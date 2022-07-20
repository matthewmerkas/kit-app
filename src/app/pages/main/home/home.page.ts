import { Component, OnInit } from '@angular/core'
import { io } from 'socket.io-client'
import { removeTokens } from '../../../functions/local-storage'
import { Router } from '@angular/router'
import { Platform } from '@ionic/angular'
import { Store } from '../../../stores/store'
import { FormControl } from '@angular/forms'
import { debounceTime, distinctUntilChanged } from 'rxjs'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  searchForm = new FormControl('')

  constructor(
    public platform: Platform,
    private router: Router,
    public store: Store
  ) {
    // const socket = io('http://10.0.0.50:3000/')
  }

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
          .subscribe()
      })
  }

  logout() {
    removeTokens()
    return this.router.navigate(['/auth'])
  }

  onWillPresent() {
    this.store.user.getList().subscribe()
  }

  refresh(ev) {
    setTimeout(() => {
      ev.detail.complete()
    }, 3000)
  }
}
