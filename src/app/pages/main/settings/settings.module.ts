import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { SettingsPageRoutingModule } from './settings-routing.module'

import { SettingsPage } from './settings.page'
import { LoginPageModule } from '../../auth/login/login.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsPageRoutingModule,
    ReactiveFormsModule,
    LoginPageModule,
  ],
  declarations: [SettingsPage],
})
export class SettingsPageModule {}
