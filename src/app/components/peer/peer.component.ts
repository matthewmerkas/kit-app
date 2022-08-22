import { Component, Input } from '@angular/core'
import { formatDatetime } from 'src/app/functions/datetime'
import { Message } from '../../functions/types'
import { Store } from '../../stores/store'
import { animations } from '../../functions/animations'

@Component({
  selector: 'app-peer',
  templateUrl: './peer.component.html',
  styleUrls: ['./peer.component.scss'],
  animations: animations(),
})
export class PeerComponent {
  @Input() message: Message

  constructor(public store: Store) {}

  formatDatetime(iso: string) {
    return formatDatetime(iso, true)
  }
}
