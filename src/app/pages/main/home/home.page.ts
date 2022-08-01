import { Component, OnInit } from '@angular/core'
import { io } from 'socket.io-client'
import { removeTokens } from '../../../functions/local-storage'
import { Router } from '@angular/router'
import { Store } from '../../../stores/store'
import { FormControl } from '@angular/forms'
import { debounceTime, distinctUntilChanged, EMPTY, map } from 'rxjs'
import { catchError } from 'rxjs/operators'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  searchForm = new FormControl('')
  users = []

  constructor(private router: Router, public store: Store) {
    // const socket = io('http://10.0.0.50:3000/')
  }

  ngOnInit() {
    this.store.message.getLatest().subscribe()
    this.store.user.getMe().subscribe()

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
