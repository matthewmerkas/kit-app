import { ChangeDetectorRef, Component } from '@angular/core'
import { Platform } from '@ionic/angular'
import { io } from 'socket.io-client'
import { animations } from './functions/animations'
import { Store } from './stores/store'
import { environment } from '../environments/environment'
import { Message } from './functions/types'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  animations: animations('150ms', '1s'),
})
export class AppComponent {
  constructor(
    private changeDetectionRef: ChangeDetectorRef,
    public store: Store,
    public platform: Platform
  ) {
    store.info.get().subscribe(() => {
      this.changeDetectionRef.detectChanges()
    })
    const socket = io(environment.apiUrl, {
      path: environment.apiPath,
    })
    socket.on('create message', (s) => {
      // If target user matches logged-in user, download message and push to memory
      if (s.user === store.user.me._id) {
        store.message.get(s._id).subscribe((m: Message) => {
          store.message.push(m)
        })
      }
    })
  }
}
