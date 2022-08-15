import { Component, OnInit } from '@angular/core'
import { removeTokens } from '../../../functions/local-storage'
import { Router } from '@angular/router'
import { Store } from '../../../stores/store'
import { EMPTY, map } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { animations } from '../../../functions/animations'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  animations: animations(),
})
export class HomePage implements OnInit {
  constructor(private router: Router, public store: Store) {}

  ngOnInit() {
    this.store.message.getLatest().subscribe()
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
