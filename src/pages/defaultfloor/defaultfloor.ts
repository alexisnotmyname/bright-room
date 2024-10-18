import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
import { HomePage } from '../home/home';
import { Storage } from '@ionic/storage';
import { RestProvider } from '../../providers/rest/rest';

/**
 * Generated class for the DefaultfloorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-defaultfloor',
  templateUrl: 'defaultfloor.html',
})
export class DefaultfloorPage {

  userProfile: any = null;
  floors: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private auth: AuthService,
              public storage: Storage,
              public restProvider: RestProvider) {

    this.userProfile = this.auth.getUser();
    this.restProvider.getFloors().then(data => {
      this.floors = data;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DefaultfloorPage');
  }

  saveDefaultFloor(floor){
    this.navCtrl.setRoot(HomePage);
    this.storage.set('def_floor', floor);
  }

}
