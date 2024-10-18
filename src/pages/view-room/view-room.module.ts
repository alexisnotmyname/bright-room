import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewRoomPage } from './view-room';
import { TimerComponent } from '../../components/timer/timer';

@NgModule({
  declarations: [
    ViewRoomPage,
    TimerComponent
  ],
  imports: [
    IonicPageModule.forChild(ViewRoomPage),
  ],
})
export class ViewRoomPageModule {}
