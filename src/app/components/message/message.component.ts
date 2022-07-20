import { Component, OnInit, Input } from '@angular/core'
import { Message } from '../../functions/types'

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  @Input() message: Message

  constructor() {}

  ngOnInit() {}

  isIos() {
    const win = window as any
    return win && win.Ionic && win.Ionic.mode === 'ios'
  }
}
