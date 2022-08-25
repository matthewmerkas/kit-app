import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { EMPTY, map } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { animations } from '../../../functions/animations'
import { removeTokens } from '../../../functions/local-storage'
import { Store } from '../../../stores/store'
import {
  addListeners,
  createChannels,
  registerNotifications,
} from '../../../functions/push-notifications'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  animations: animations(),
})
export class HomePage implements OnInit {
  constructor(private router: Router, public store: Store) {}

  async ngOnInit() {
    this.store.message.getLatest().subscribe()
    this.store.user.getMe().subscribe()

    // Notifications
    await addListeners()
    await createChannels()
    await registerNotifications()
  }

  logout() {
    removeTokens()
    return this.router.navigate(['/auth'])
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
