import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IonicModule } from '@ionic/angular'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { HomePage } from './home.page'
import { HomePageRoutingModule } from './home-routing.module'
import { MessageComponentModule } from '../../../components/message/message.module'
import { PeerComponentModule } from '../../../components/peer/peer.module'
import { PeopleSearchComponent } from '../../../components/people-search/people-search.component'
import { LoginPageModule } from '../../auth/login/login.module'
import { PeerPageModule } from '../peer/peer.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MessageComponentModule,
    HomePageRoutingModule,
    ReactiveFormsModule,
    PeerComponentModule,
    LoginPageModule,
    PeerPageModule,
  ],
  declarations: [HomePage, PeopleSearchComponent],
  exports: [PeopleSearchComponent],
})
export class HomePageModule {}
