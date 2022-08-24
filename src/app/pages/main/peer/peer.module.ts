import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { PeerPage } from './peer.page'

import { IonicModule } from '@ionic/angular'

import { PeerPageRoutingModule } from './peer-routing.module'
import { MessageComponentModule } from '../../../components/message/message.module'
import { ScrollingModule } from '@angular/cdk/scrolling'
import { LoginPageModule } from '../../auth/login/login.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PeerPageRoutingModule,
    MessageComponentModule,
    ScrollingModule,
    LoginPageModule,
  ],
  declarations: [PeerPage],
})
export class PeerPageModule {}
