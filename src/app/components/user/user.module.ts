import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'

import { IonicModule } from '@ionic/angular'

import { UserComponent } from './user.component'

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule],
  declarations: [UserComponent],
  exports: [UserComponent],
})
export class UserComponentModule {}
