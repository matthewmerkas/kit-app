import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { UserPage } from './user.page'

import { IonicModule } from '@ionic/angular'

import { UserPageRoutingModule } from './user-routing.module'
import { MessageComponentModule } from '../../../components/message/message.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserPageRoutingModule,
    MessageComponentModule,
  ],
  declarations: [UserPage],
})
export class UserPageModule {}
