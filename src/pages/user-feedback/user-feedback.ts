import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

/**
 * Generated class for the UserFeedbackPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-feedback',
  templateUrl: 'user-feedback.html',
})
export class UserFeedbackPage {

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public viewCtrl: ViewController,
              private iab: InAppBrowser) {
  }

  rateMe() {
    const browser = this.iab.create('https://goo.gl/forms/Zpj6qhxOEzNyCVcn2');
    browser.show();
    browser.on('exit').subscribe(event => {
      this.dismiss()
   });
   this.dismiss()
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
