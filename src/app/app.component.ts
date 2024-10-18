import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Platform, ModalController, Events, AlertController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { DefaultfloorPage } from '../pages/defaultfloor/defaultfloor';

import { AuthService } from '../services/auth.service';
import { Storage } from '@ionic/storage';
import * as mqtt from 'mqtt';
import { ModalAwayPage } from '../pages/modal-away/modal-away';
import { RestProvider } from '../providers/rest/rest';
import { ViewRoomPage } from '../pages/view-room/view-room';
import { ModalReservePromptPage } from '../pages/modal-reserve-prompt/modal-reserve-prompt';
import { FCM } from '@ionic-native/fcm';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  rootPage;
  private platform;
  public client: mqtt.Client;

  constructor(platform: Platform, 
              private statusBar: StatusBar,
              private splashScreen: SplashScreen, 
              private auth: AuthService,
              public storage: Storage,
              public modalCtrl: ModalController,
              public events: Events,
              public restProvider: RestProvider,
              public alertCtrl: AlertController,
              public fcm: FCM
  ) 
  {
    platform.ready().then(() => {
      this.setupFCM()
      this.initializeApp();
      events.subscribe('roomaway:checkout', (roomId) => {
        this.restProvider.checkoutRoom(roomId).then(result => {
          console.log(result);
          this.events.publish('roomBooked:changed');
          this.events.publish('viewroom:pop');
          this.storage.remove("reservation")
        }, (err) => {
          console.log(err);
        });
      });
    })
  }

  setupFCM(){
    console.log("FCM Device token ",this.fcm.getToken())
    this.fcm.subscribeToTopic('marketing');
    this.fcm.onNotification().subscribe(data => {
      if(data.wasTapped){
        console.log("Received in background");
      } else {
        console.log("Received in foreground");
      };
    });
  }

  initializeApp() {
    this.auth.afAuth.authState
				.subscribe(
					user => {
						if (user) {
              if(user.email.includes('globe.com') || user.email.includes('brightroomtester')){
                this.connectToMqtt(user);
                this.storage.get('def_floor').then((val) => {
                  if(val) {
                    this.rootPage = HomePage;
                  }else {
                    this.rootPage = DefaultfloorPage;
                  }
                });
              }else {
                this.presentAlert();
                this.rootPage = LoginPage;
              }
						} else {
							this.rootPage = LoginPage;
						}
					},
					() => {
            this.events.publish('login:loading');
						this.rootPage = LoginPage;
					}
        );
  }

  presentAlert(){
    let alert = this.alertCtrl.create({
      title: 'Bright Room',
      message: 'Must be a valid Globe email',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          handler: () => {
            this.auth.signOut()
          }
        }
      ]
    });
    alert.present();
  }

  connectToMqtt(user) {
    this.client = mqtt.connect('ws://13.229.74.53:1884');
    this.client.addListener('connect', ()=>{
      console.log('connected');
      this.client.subscribe('room/movement/'+user.email);
      this.client.subscribe('room/event');
      this.client.subscribe('room/auto/checkout/'+user.email);
    });

    this.client.on('message', (topic, message) =>{
      console.log("topic:",topic.toString())
      console.log("message:", message.toString())
      
      if(topic=='room/movement/'+user.email){
        this.modalCtrl.create(ModalAwayPage, {msg:message}).present();
      } else if(topic=='room/event'){
        this.events.publish('roomBooked:changed');
        // this.change.detectChanges();
      } else if(topic == 'room/auto/checkout/'+user.email){
        this.storage.remove("reservation")
        this.events.publish('roomBooked:stopscan');
        this.modalCtrl.create(ModalReservePromptPage, {msg:message}).present();
      }
    });
  }
}

