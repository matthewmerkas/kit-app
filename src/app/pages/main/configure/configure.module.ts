import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { ConfigurePageRoutingModule } from './configure-routing.module'

import { ConfigurePage } from './configure.page'
import { LoginPageModule } from '../../auth/login/login.module'
import { Ndef, NFC } from '@awesome-cordova-plugins/nfc/ngx'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfigurePageRoutingModule,
    ReactiveFormsModule,
    LoginPageModule,
  ],
  declarations: [ConfigurePage],
  providers: [NFC, Ndef],
})
export class ConfigurePageModule {}
