import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalPromptPage } from './modal-prompt';

@NgModule({
  declarations: [
    ModalPromptPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalPromptPage),
  ],
})
export class ModalPromptPageModule {}
