import { Component, OnInit } from '@angular/core'
import { removeTokens } from '../../../functions/local-storage'
import { Router } from '@angular/router'
import { Store } from '../../../stores/store'
import { FormControl } from '@angular/forms'
import { debounceTime, distinctUntilChanged, EMPTY, map } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { animations } from '../../../functions/animations'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  animations: animations(),
})
export class HomePage implements OnInit {
  searchForm = new FormControl('')
  users = []

  constructor(private router: Router, public store: Store) {}

  ngOnInit() {
    this.searchForm.valueChanges
      .pipe(debounceTime(100), distinctUntilChanged())
      .subscribe((value) => {
        this.store.user
          .getList({
            $or: JSON.stringify([
              { displayName: { $regex: value, $options: 'i' } },
              { username: { $regex: value, $options: 'i' } },
            ]),
          })
          .subscribe((res) => {
            this.users = res
          })
      })
  }

  ionViewWillEnter() {
    this.searchForm.reset('')
  }

  logout() {
    removeTokens()
    return this.router.navigate(['/auth'])
  }

  onWillPresent() {
    this.store.user.getList().subscribe((res) => {
      this.users = res
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
