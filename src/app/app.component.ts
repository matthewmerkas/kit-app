import { Component } from '@angular/core'
import { io } from 'socket.io-client'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'KIT'

  constructor() {
    const socket = io('http://10.0.0.50:3000')
  }
}
