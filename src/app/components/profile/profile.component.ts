import { Component, Input, OnInit } from '@angular/core'
import { User } from '../../functions/types'
import { Platform } from '@ionic/angular'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  @Input() trigger = 'view-profile'
  @Input() user: User

  breakpoint

  constructor(private platform: Platform) {}

  ngOnInit() {
    this.breakpoint = 440 / this.platform.height()
  }
}
