import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';

/**
 * Generated class for the ModalAwayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-away',
  templateUrl: 'modal-away.html',
})
export class ModalAwayPage {

  roomId: any;
  message;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public events: Events) {
    this.message = String(navParams.get('msg')).replace(/ *\[[^)]*\] */g, "");;
    let regExp = /\[([^)]+)\]/;
    let matches = regExp.exec(navParams.get('msg'));
    if(matches){
      this.roomId = matches[1];
      console.log("roomId",this.roomId)
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  checkout() {
    this.events.publish('roomaway:checkout', this.roomId);
    this.viewCtrl.dismiss();
  }

}
