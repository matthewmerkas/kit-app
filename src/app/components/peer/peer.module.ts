import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'

import { IonicModule } from '@ionic/angular'

import { PeerComponent } from './peer.component'
import { LoginPageModule } from '../../pages/auth/login/login.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    LoginPageModule,
  ],
  declarations: [PeerComponent],
  exports: [PeerComponent],
})
export class PeerComponentModule {}
