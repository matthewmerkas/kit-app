import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { LoginPageRoutingModule } from './login-routing.module'

import { LoginPage } from './login.page'
import { UserFormComponent } from '../../../components/user-form/user-form.component'
import { AvatarComponent } from '../../../components/avatar/avatar.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [LoginPage, UserFormComponent, AvatarComponent],
  exports: [UserFormComponent, AvatarComponent],
})
export class LoginPageModule {}
