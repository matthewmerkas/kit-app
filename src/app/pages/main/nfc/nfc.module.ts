import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { NfcPageRoutingModule } from './nfc-routing.module'

import { NfcPage } from './nfc.page'
import { HomePageModule } from '../home/home.module'
import { NFC, Ndef } from '@awesome-cordova-plugins/nfc/ngx'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NfcPageRoutingModule,
    HomePageModule,
  ],
  declarations: [NfcPage],
  providers: [NFC, Ndef],
})
export class NfcPageModule {}
