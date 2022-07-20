import { Component } from '@angular/core'
import { io } from 'socket.io-client'
import { DataService, Message } from '../../../services/data.service'
import { removeTokens } from '../../../functions/local-storage'
import { Router } from '@angular/router'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private data: DataService, private router: Router) {
    const socket = io('http://10.0.0.50:3000/')
  }

  logout() {
    removeTokens()
    return this.router.navigate(['/auth'])
  }

  refresh(ev) {
    setTimeout(() => {
      ev.detail.complete()
    }, 3000)
  }

  getMessages(): Message[] {
    return this.data.getMessages()
  }
}
