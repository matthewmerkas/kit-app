import { Location } from '@angular/common'
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core'
import { IonRouterOutlet, NavController, Platform } from '@ionic/angular'
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
  @ViewChild(IonRouterOutlet, { static: true }) routerOutlet: IonRouterOutlet

  constructor(
    private changeDetectionRef: ChangeDetectorRef,
    private location: Location,
    private navCtrl: NavController,
    public store: Store,
    public platform: Platform
  ) {
    platform.backButton.subscribeWithPriority(10, () => {
      if (
        this.location.isCurrentPathEqualTo('/home') ||
        !this.routerOutlet.canGoBack()
      ) {
        this.store.ui.setExit(true)
      } else {
        this.navCtrl.pop()
      }
    })
    store.info.get().subscribe(() => {
      this.changeDetectionRef.detectChanges()
    })
    // TODO: Get wss:// to ws:// (SSL WebSockets) working with Apache reverse proxy (& remove upgrade: false)
    const socket = io(environment.socketUri, {
      path: environment.socketPath,
    })
    socket.on('create message', (s) => {
      // If target user matches logged-in user, download message and push to memory
      if (s.user === store.user.me._id) {
        store.message.get(s._id).subscribe((m: Message) => {
          store.message.push(m)
        })
      }
    })
    socket.on('error', (err) => {
      console.log(err)
      socket.connect()
    })
  }
}
