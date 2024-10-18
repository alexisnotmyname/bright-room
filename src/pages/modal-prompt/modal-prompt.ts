import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { TimerProvider } from '../../providers/timer/timer';

/**
 * Generated class for the ModalPromptPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-prompt',
  templateUrl: 'modal-prompt.html',
})
export class ModalPromptPage {

  roomId: any;
  displayTime: any;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public viewCtrl: ViewController,
              public events: Events,
              public timerProvider: TimerProvider) {

    this.roomId = navParams.get('id');
    this.displayTime = timerProvider.displayRemainingTime(navParams.get('scndsRemaining'));
  }
  
  dismiss() {
    this.viewCtrl.dismiss();
  }

  checkout() {
    this.events.publish('room:checkout', this.roomId);
    this.viewCtrl.dismiss();
  }
}
