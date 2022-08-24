import { Component, Input, OnInit } from '@angular/core'
import { formatDatetime } from 'src/app/functions/datetime'
import { Message } from '../../functions/types'
import { Store } from '../../stores/store'
import { animations } from '../../functions/animations'
import { Platform } from '@ionic/angular'

@Component({
  selector: 'app-peer',
  templateUrl: './peer.component.html',
  styleUrls: ['./peer.component.scss'],
  animations: animations(),
})
export class PeerComponent implements OnInit {
  @Input() message: Message

  constructor(public platform: Platform, public store: Store) {}

  ngOnInit() {
    this.store.ui.socket.on('update user', (s) => {
      const peerId = this.message.peer?._id
      if (s._id === peerId) {
        this.store.user.get(peerId, true).subscribe((res) => {
          this.message.peer = res
        })
      }
    })
  }

  formatDatetime(iso: string) {
    return formatDatetime(iso, true)
  }
}
