import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ModalController, AlertController, Platform } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { TimerComponent } from '../../components/timer/timer';
import { DatePipe } from '@angular/common';
import { ModalPromptPage } from '../modal-prompt/modal-prompt';
import { TimerProvider } from '../../providers/timer/timer';
import { UtilProvider } from '../../providers/util/util';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';
import { UserFeedbackPage } from '../user-feedback/user-feedback';

/**
 * Generated class for the ViewRoomPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-room',
  templateUrl: 'view-room.html',
})
export class ViewRoomPage {
  
  floor:any;
  userProfile: any;
  beaconNear:boolean;
  @ViewChild(TimerComponent) timer: TimerComponent;
  timerSeconds:any = 300;

  constructor(private platform: Platform,
              public navCtrl: NavController, 
              public navParams: NavParams, 
              public restProvider: RestProvider,
              public events: Events,
              private change:ChangeDetectorRef,
              public datepipe: DatePipe,
              public modalCtrl: ModalController,
              public timerProvider: TimerProvider,
              public util: UtilProvider,
              public alertCtrl: AlertController,
              public storage: Storage) {
    
    this.floor = navParams.data.room;
    this.userProfile = navParams.data.userProfile;

    if(this.floor.status != 0){
      if(this.userProfile.email == this.floor.reservation.employeeId){
        this.loadTimer();
      }
    }

    events.subscribe('room:checkout', (roomId) => {
      this.restProvider.checkoutRoom(roomId).then((result:any) => {
        console.log(result);
        this.events.publish('roomBooked:changed');
        this.events.publish('roomBooked:stopscan');
        this.storage.remove("reservation");
        this.navCtrl.pop();
        this.modalCtrl.create(UserFeedbackPage).present();
      }, (err) => {
        console.log(err);
      });
    });

    events.subscribe('viewroom:pop', () => {
      this.navCtrl.pop();
    });

    events.subscribe('roomBooked:checkin', () => {
      this.navCtrl.pop();
    });
  }

  ionViewWillUnload(){
    this.events.unsubscribe('room:checkout');
    this.events.unsubscribe('viewroom:pop');
    this.events.unsubscribe('roomBooked:checkin');
  }

  startTimer() {
    if(this.floor.status != 0){
      if(this.userProfile.email == this.floor.reservation.employeeId){
        this.timer.startTimer();
      }
    }
  }

  loadTimer() {
    if(this.floor.reservation){
      let timeRemaining =  this.timerProvider.computeRemainingTime(this.floor.reservation.endTimestamp);
      if(timeRemaining>0){
        this.timerSeconds = timeRemaining;
      }
    }
  }

  ionViewDidLoad() {
    this.startTimer()
  }

  reserve() {
    let latest_date =this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
    let data = {
      roomId: this.floor.roomId,
      employeeId: this.userProfile.email,
      timestamp: latest_date
    }

    console.log(JSON.stringify(data));
    this.restProvider.reserveRoom(data).then((result:any) => {
      if(result.success == 'false') {
        this.presentErrorAlert(result.reason);
      }else {
        this.restProvider.getRoomById(this.floor.roomId).then(_result => {
          console.log(_result);
          this.reloadRoomData(_result);
          this.loadTimer()
          this.startTimer()
          this.events.publish('roomBooked:scan');
          this.storage.set("reservation", this.floor.roomId);
        }, (err) => {
          console.log(err);
        });
      }
      
    }, (err) => {
      console.log(err);
    });
  }

  checkout(roomId) {
    let timeRemaining =  this.timerProvider.computeRemainingTime(this.floor.reservation.endTimestamp);
    if(timeRemaining>0){
      this.timerSeconds = timeRemaining;
    } 

    this.modalCtrl.create(ModalPromptPage, 
      {id:roomId,
      scndsRemaining: this.timerSeconds}).present();
  }

  reloadRoomData(result) {
    this.events.publish('roomBooked:changed');
    this.floor = result;
    // this.change.detectChanges();
    if (!this.change['destroyed']) {
      this.change.detectChanges();
    }
  }

  presentErrorAlert(errMsg) {
    let alert = this.alertCtrl.create({
      title: 'Reservation Error',
      message: errMsg,
      buttons: [
        {
          text: 'Okay',
          role: 'cancel',
          handler: () => {
            console.log('dismiss clicked');
          }
        }
      ]
    });
    alert.present();
  }
}
