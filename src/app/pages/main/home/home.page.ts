import { Component } from '@angular/core'
import { io } from 'socket.io-client'
import { DataService, Message } from '../../../services/data.service'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private data: DataService) {
    const socket = io('http://10.0.0.50:3000/')
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
