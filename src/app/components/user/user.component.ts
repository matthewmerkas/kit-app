import { Component, OnInit, Input } from '@angular/core'
import { formatDatetime } from 'src/app/functions/datetime'
import { Message } from '../../functions/types'
import { Store } from '../../stores/store'
import { animations } from '../../functions/animations'

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  animations: animations(),
})
export class UserComponent implements OnInit {
  @Input() message: Message

  constructor(public store: Store) {}

  ngOnInit() {}

  formatDatetime(iso: string) {
    return formatDatetime(iso)
  }
}
