import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { PeerPage } from './peer.page'

import { IonicModule } from '@ionic/angular'

import { PeerPageRoutingModule } from './peer-routing.module'
import { MessageComponentModule } from '../../../components/message/message.module'
import { ScrollingModule } from '@angular/cdk/scrolling'
import { LoginPageModule } from '../../auth/login/login.module'
import { ProfileComponent } from '../../../components/profile/profile.component'
import { LabelComponent } from '../../../components/label/label.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PeerPageRoutingModule,
    MessageComponentModule,
    ScrollingModule,
    LoginPageModule,
    ReactiveFormsModule,
  ],
  declarations: [PeerPage, ProfileComponent, LabelComponent],
  exports: [LabelComponent],
})
export class PeerPageModule {}
