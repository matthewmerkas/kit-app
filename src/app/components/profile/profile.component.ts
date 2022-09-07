import { Component, Input, OnChanges, OnInit } from '@angular/core'
import { User } from '../../functions/types'
import { Platform } from '@ionic/angular'
import { FormControl } from '@angular/forms'
import { Store } from '../../stores/store'
import { animations } from '../../functions/animations'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: animations('100ms'),
})
export class ProfileComponent implements OnInit, OnChanges {
  @Input() trigger = 'view-profile'
  @Input() user: User

  breakpoint: number
  nicknameForm = new FormControl('')
  oldNickname: string
  showInfo = false

  constructor(private platform: Platform, private store: Store) {}

  ngOnInit() {
    this.breakpoint = 440 / this.platform.height()
  }

  ngOnChanges() {
    if (this.user) {
      this.nicknameForm.patchValue(this.user.nickname)
      this.oldNickname = this.user.nickname
    }
  }

  onDismiss() {
    const nickname = this.nicknameForm.getRawValue()
    if (nickname !== this.oldNickname) {
      const data = {
        userId: this.store.user.me._id,
        peerId: this.user._id,
        value: nickname,
      }
      this.store.nickname.update(data).subscribe(() => {
        this.user.nickname = nickname
      })
    }
  }
}
