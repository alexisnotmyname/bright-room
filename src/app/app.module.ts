import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { HomePage, FloorSelectPage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { DefaultfloorPage } from '../pages/defaultfloor/defaultfloor';

import { AuthService } from '../services/auth.service';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { firebaseConfig } from './app.firebase.config';
import { GooglePlus } from '@ionic-native/google-plus';
import { IonicStorageModule } from '@ionic/storage';
import { RestProvider } from '../providers/rest/rest';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';

import { LoginPageModule } from '../pages/login/login.module';
import { DefaultfloorPageModule } from '../pages/defaultfloor/defaultfloor.module';
import { ViewRoomPageModule } from '../pages/view-room/view-room.module';
import { PipesModule } from '../pipes/pipes.module';
import { ModalAwayPage } from '../pages/modal-away/modal-away';
import { ModalAwayPageModule } from '../pages/modal-away/modal-away.module';
import { ModalPromptPage } from '../pages/modal-prompt/modal-prompt';
import { ModalPromptPageModule } from '../pages/modal-prompt/modal-prompt.module';
import { TimerProvider } from '../providers/timer/timer';
import { UtilProvider } from '../providers/util/util';
import { ModalReservePromptPageModule } from '../pages/modal-reserve-prompt/modal-reserve-prompt.module';
import { ModalReservePromptPage } from '../pages/modal-reserve-prompt/modal-reserve-prompt';
// import { WalkthroughPage } from '../pages/walkthrough/walkthrough';
import { UserFeedbackPage } from '../pages/user-feedback/user-feedback';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { UserFeedbackPageModule } from '../pages/user-feedback/user-feedback.module';
import { FCM } from '@ionic-native/fcm';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    DefaultfloorPage,
    FloorSelectPage,
    ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig.fire),
    AngularFireAuthModule,
    LoginPageModule,
    DefaultfloorPageModule,
    ViewRoomPageModule,
    ModalAwayPageModule,
    ModalPromptPageModule,
    ModalReservePromptPageModule,
    PipesModule,
    UserFeedbackPageModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    DefaultfloorPage,
    FloorSelectPage,
    ModalAwayPage,
    ModalPromptPage,
    ModalReservePromptPage,
    UserFeedbackPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GooglePlus,
    AngularFireAuthModule,
    AuthService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DatePipe,
    RestProvider,
    TimerProvider,
    UtilProvider,
    InAppBrowser,
    FCM
  ]
})
export class AppModule {}
