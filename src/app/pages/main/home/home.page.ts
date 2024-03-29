import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { EMPTY, map } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { animations } from '../../../functions/animations'
import {
  getItem,
  getToken,
  removeTokens,
} from '../../../functions/local-storage'
import { Store } from '../../../stores/store'
import {
  addListeners,
  createChannels,
  registerNotifications,
} from '../../../functions/push-notifications'
import { Platform } from '@ionic/angular'
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  animations: animations(),
})
export class HomePage implements OnInit {
  modalRef: HTMLIonModalElement

  constructor(
    public platform: Platform,
    private router: Router,
    public store: Store,
    private toastr: ToastrService
  ) {}

  async ngOnInit() {
    this.store.message.getLatest().subscribe()
    this.store.user.getMe().subscribe()

    // Notifications
    if (this.platform.is('capacitor')) {
      await addListeners(this.router, this.store, this.toastr)
      await createChannels()
      await registerNotifications()
    }
    this.platform.resume.subscribe(() => {
      if (getToken()) {
        this.store.message.getLatest()
      }
    })
  }

  logout() {
    const data = {
      fcmToken: getItem('fcm_token'),
    }
    this.store.user.logout(data).subscribe(() => {
      removeTokens()
      return this.router.navigate(['/auth'])
    })
  }

  refresh(ev) {
    return this.store.message
      .getLatest()
      .pipe(
        map(() => {
          ev.detail.complete()
        }),
        catchError(() => {
          ev.detail.complete()
          return EMPTY
        })
      )
      .subscribe()
  }
}
