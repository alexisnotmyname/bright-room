import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AuthService } from '../../services/auth.service';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loading;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private auth: AuthService,
              public loadingCtrl: LoadingController,
              public events: Events) {
  }

  loginWithGoogle() {
    // this.auth.signInWithGoogle()
    //   .then(
    //     () => this.navCtrl.setRoot(HomePage),
    //     error => console.log(error.message)
    //   );
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();

    this.auth.signInWithGoogle().then(() =>{
      this.loading.dismiss();
    });

   
    
  }

}
