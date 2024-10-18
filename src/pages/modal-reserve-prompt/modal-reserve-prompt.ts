import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events, ModalController } from 'ionic-angular';
import { UserFeedbackPage } from '../user-feedback/user-feedback';

/**
 * Generated class for the ModalReservePromptPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-reserve-prompt',
  templateUrl: 'modal-reserve-prompt.html',
})
export class ModalReservePromptPage {

  message: any;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public viewCtrl: ViewController,
              public events: Events,
              public modalCtrl: ModalController) {
    this.message = navParams.get('msg');
  }

  dismiss() {
    this.viewCtrl.dismiss();
    this.events.publish('viewroom:pop');
    this.modalCtrl.create(UserFeedbackPage).present();

  }

}
