import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, Platform, NavParams, ViewController, Events, AlertController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { RestProvider } from '../../providers/rest/rest';
import { AuthService } from '../../services/auth.service';
import { ModalController } from 'ionic-angular';
import { ViewRoomPage } from '../view-room/view-room';
import { UtilProvider } from '../../providers/util/util';
import { TimerProvider } from '../../providers/timer/timer';
import { DatePipe } from '@angular/common';
import { LoginPage } from '../login/login';
// import { WalkthroughPage } from '../walkthrough/walkthrough';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  beacon;
  beaconData;
  beaconDataPrev;
  // distanceArr;
  // distanceArrPrev;
  // lowestDistance: any = 0;
  // lowestDistancePrev: any = 0;
  // ctr = 0;
  userProfile: any = null;
  roomsData: any;
  currentFloorSelected: any;

  constructor(private change:ChangeDetectorRef, 
              private platform: Platform,
              private auth: AuthService,
              public storage: Storage,
              public restProvider: RestProvider,
              public modalCtrl: ModalController,
              public navCtrl: NavController,
              public events: Events,
              public timerProvider: TimerProvider,
              public util: UtilProvider,
              public datepipe: DatePipe,
              public alertCtrl: AlertController) 
  {
      this.userProfile = this.auth.getUser();
      this.storage.get('def_floor').then((val) => {
        if(val) {
          this.currentFloorSelected = val;
          this.reloadFloorTiles();
        }
      });
      
      events.subscribe('floorSelected:changed', (floor) => {
        this.storage.set('def_floor', floor);
        this.currentFloorSelected = floor;
        this.reloadFloorTiles();
      });

      events.subscribe('roomBooked:changed', () => {
        this.reloadFloorTiles();
      });

      events.subscribe('roomBooked:stopscan', () => {
        this.stopScan();
      });

      events.subscribe('roomBooked:scan', () => {
        this.startScan();
      });
  }

  ionViewDidLoad() {
    // if(this.storage.get('firstrun').then((val)=>{
    //   if(!val){
    //     this.storage.set('firstrun', 1);
    //     this.navCtrl.push(WalkthroughPage)
    //   }
    // }))
    this.rescan()
  }

  rescan() {
    this.storage.get('reservation').then((val) => {
      if(val){
        console.log('reservation',val)
        this.stopScan();
        this.startScan();
      }
    })
  }

  async reloadFloorTiles(): Promise<void> {
    this.restProvider.getFloorByLvl(this.currentFloorSelected)
    .then(data => {
      this.roomsData = data;
      // this.checkForTimeRemaining();
      console.log(this.roomsData);
      if (!this.change['destroyed']) {
        this.change.detectChanges();
      }
      
    });
  }

  doRefresh(refresher) {
    this.reloadFloorTiles().then(() =>{
      refresher.complete();
    })
  }

  checkForTimeRemaining() {
    setTimeout(() => {   
      for(let room of this.roomsData) { 
        if(room.reservation){
          let timeRemaining =  this.timerProvider.getRemainingTimeMins(room.reservation.endTimestamp);  
          room.reservation.timeRemaining = timeRemaining;
          if(timeRemaining>0){
            this.checkForTimeRemaining();
          }
        } 
      } 
    }, 1000);
  }

  // pingBeacon() {
  //   setInterval(() => {
  //     this.stopScan();
  //     this.startScan();
  //   }, 60000)
  // }

  resetBeaconData() {
    this.beaconDataPrev = {
      bid: 0  
    }
    this.beaconData = {
      bid:0
    }
    // this.distanceArr = new Array()
    // this.distanceArrPrev = new Array()
  }

  startScan(){
    this.resetBeaconData();
    console.log('start scan')
    this.platform.ready().then(() => {
      evothings.eddystone.startScan((data) => {

        if(this.beaconData.bid == data.bid && 
          this.beaconDataPrev.bid == data.bid){
            this.beacon = this.beaconData
            if(this.processBeaconData()){
              this.resetBeaconData()
            }
        }
      
        if(this.beaconData.bid != data.bid){
          if(this.beaconData.bid != this.beaconDataPrev.bid){
            this.beaconDataPrev = this.beaconData
          }
          this.beaconData = data

          let distance1 = this.util.computeDistance(this.beaconData)
          let distance2 = this.util.computeDistance(this.beaconDataPrev)

          console.log('prev',this.util.uint8ArrayToString(this.beaconDataPrev.bid))
          console.log('prev distance',distance2)
          console.log('current',this.util.uint8ArrayToString(this.beaconData.bid))
          console.log('current distance',distance1)
          
          let checkinFound
          if(this.beaconDataPrev.bid != 0){
            if(distance1 < distance2){
              this.beacon = this.beaconData
            }else {
              this.beacon = this.beaconDataPrev
            }

            if(this.processBeaconData()){
              this.resetBeaconData()
            }
          }
        }
      }, error => console.error(error));
    })

    setTimeout(() => {
      if(this.beaconDataPrev.bid == 0 && this.beaconData.bid != 0){
        console.log('could not detect any other beacon w/in 30s')
        this.beacon = this.beaconData
        if(!this.processBeaconData()){
          this.resetBeaconData()
        }
      }
    }, 30000);
  }

  public stopScan(){
    this.resetBeaconData()
    console.log('stopped scanning')
    this.platform.ready().then(() => {
      evothings.eddystone.stopScan()      
    })
  }

  processBeaconData(): boolean {
    for(let room of this.roomsData){
      if(room.device.deviceId == this.util.uint8ArrayToString(this.beacon.bid)){// find room with beacon.instanceid
        if(room.reservation && room.reservation.employeeId == this.userProfile.email){ // check if reservation
          if(room.reservation.status == 1){
            let dateNow =this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
            let jsonBody = {
              roomId: room.roomId,
              checkinTimestamp: dateNow
            }
            this.restProvider.checkinRoom(jsonBody).then(result => {
              console.log(result);
              this.events.publish('roomBooked:checkin');
              this.events.publish('roomBooked:changed');
              this.storage.remove("reservation");
              this.stopScan();
              this.presentCheckinAlert(room.roomId);
              // this.pingBeacon();
            }, (err) => {
              console.log(err);
            });
            console.log('auto checkin');
            return true;
          } else if(room.reservation.status == 2){
            //Ping beacon logic
            // this.events.publish('room:ping', room.roomId);
            // this.stopScan() 
          }
        } else {
          console.log('do nothing');
          return false;
        }
      }
    }
  }

  presentCheckinAlert(roomId) {
    let alert = this.alertCtrl.create({
      title: 'Bright Room',
      message: 'You are now checked-in on room '+roomId,
      buttons: [
        {
          text: 'Dismiss',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    alert.present();
  }

  // checkRoomIfReservedForYou(room:any) {
  //   if(room.reservation && room.reservation.employeeId == this.userProfile.email){
  //     if(room.reservation.status == 1){
  //       let dateNow =this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
  //       let jsonBody = {
  //         roomId: room.roomId,
  //         checkinTimestamp: dateNow
  //       }
  //       this.restProvider.checkinRoom(jsonBody).then(result => {
  //         console.log(result);
  //         this.events.publish('roomBooked:checkin');
  //         this.events.publish('roomBooked:changed');
  //       }, (err) => {
  //         console.log(err);
  //       });
  //       console.log('auto checkin');
  //       return true;
  //     } else if(room.reservation.status == 2){
  //       console.log('ping');
  //     }
  //   } else {
  //     console.log('do nothing');
  //     return false;
  //   }
  // }

  presentModal() {
    let modal = this.modalCtrl.create(FloorSelectPage);
    modal.present();
  }

  pushViewRoom(room) {
    this.navCtrl.push(ViewRoomPage, 
      { room: room,
        beaconData: this.beacon,
        userProfile: this.userProfile
      });
  }

  logout() {
    let alert = this.alertCtrl.create({
      title: 'Bright Room',
      message: 'Are you sure you want to log out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Log Out',
          handler: () => {
            console.log('logout clicked');
            this.stopScan();
            this.auth.signOut().then(()=> {
              this.storage.clear();
            });
            
          }
        }
      ]
    });
    alert.present();
  }

  // getGetOrdinal(num): String{
  //   num = Math.round(num);
	//   let numString = num.toString();

  //   // If the ten's place is 1, the suffix is always "th"
  //   // (10th, 11th, 12th, 13th, 14th, 111th, 112th, etc.)
  //   if (Math.floor(num / 10) % 10 === 1) {
  //     return numString + "th";
  //   }

  //   // Otherwise, the suffix depends on the one's place as follows
  //   // (1st, 2nd, 3rd, 4th, 21st, 22nd, etc.)
  //   switch (num % 10) {
  //     case 1: return numString + "st";
  //     case 2: return numString + "nd";
  //     case 3: return numString + "rd";
  //     default: return numString + "th";
  //   }
  // }
}


@Component({
  template: `
<ion-header>
  <ion-toolbar>
    <ion-title>
    Select Floor
    </ion-title>
    <ion-buttons start>
      <button ion-button (click)="dismiss()">
        <span ion-text color="primary" showWhen="ios">Cancel</span>
        <ion-icon name="md-close" showWhen="android, windows"></ion-icon>
      </button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
<ion-content padding class="bg-style">
  <ion-item *ngFor="let floor of floors" (click)="itemSelected(floor)">
    <div icon-end> 
      <h2>{{floor.floorId | ordinal}} Floor</h2>
      <p>{{floor.roomsRemaining}} room/s available</p>
    </div>
    <ion-icon large item-end name="md-home" *ngIf="defaultFloor!=floor.floorId"></ion-icon>
    <ion-icon large item-end name="md-home" color="danger" *ngIf="defaultFloor==floor.floorId"></ion-icon>
  </ion-item>
</ion-content>
`
})

export class FloorSelectPage { 
  
  // floors = [9,10,11,12,14,15,16,17,18,19,20,21,22,23,24,25,26,28];
  floors: any;
  defaultFloor: any;

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,
    public storage: Storage,
    public events: Events,
    public restProvider: RestProvider) 
  {
    this.storage.get('def_floor').then((val) => {
      if(val) {
        this.defaultFloor = val;
      }
    });
    
    this.restProvider.getFloors().then(data => {
      this.floors = data;
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  itemSelected(floor) {
    this.viewCtrl.dismiss();
    this.events.publish('floorSelected:changed', floor.floorId);
  }

  faveSelected(floor) {
    this.storage.set('def_floor', floor.floorId);
  }
}

