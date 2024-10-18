import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';

/**
 * Generated class for the WalkthroughPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-walkthrough',
  templateUrl: 'walkthrough.html',
})
export class WalkthroughPage {

  @ViewChild('slider') slider: Slides;
  slideIndex = 0;
  slides = [
    {
      title: 'Dream\'s Adventure',
      imageUrl: 'assets/imgs/lists/wishlist-1.jpg',
      description: 'Take a look at our amazing options',
    },
    {
      title: 'For the Weekend',
      imageUrl: 'assets/imgs/lists/wishlist-2.jpg',
      description: 'Take a look at our amazing options',
    },
    {
      title: 'Family Time',
      imageUrl: 'assets/imgs/lists/wishlist-3.jpg',
      description: 'Take a look at our amazing options',
    },
    {
      title: 'My Trip',
      imageUrl: 'assets/imgs/lists/wishlist-4.jpg',
      description: 'Take a look at our amazing options',
    }
  ];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalkthroughPage');
  }

  onSlideChanged() {
    this.slideIndex = this.slider.getActiveIndex();
    console.log('Slide changed! Current index is', this.slideIndex);
  }

  goToApp() {
    console.log('Go to App clicked');
    this.navCtrl.pop()
  }

  skip() {
    console.log('Skip clicked');
    this.navCtrl.pop()
  }

}
