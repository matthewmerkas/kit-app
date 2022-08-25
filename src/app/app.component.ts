import { Location } from '@angular/common'
import { Component, OnInit, ViewChild } from '@angular/core'
import { IonRouterOutlet, NavController, Platform } from '@ionic/angular'
import { animations } from './functions/animations'
import { Store } from './stores/store'
import { Message } from './functions/types'
import { SplashScreen } from '@capacitor/splash-screen'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  animations: animations('150ms', '1s'),
})
export class AppComponent implements OnInit {
  @ViewChild(IonRouterOutlet, { static: true }) routerOutlet: IonRouterOutlet

  constructor(
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

    store.ui.socket.on('create message', (s) => {
      // If target user matches logged-in user, download message and push to memory
      if (s.user === store.user.me?._id) {
        store.message.get(s._id).subscribe((m: Message) => {
          store.message.push(m)
        })
      }
    })
  }

  ngOnInit() {
    this.store.info.get().subscribe()
    this.platform.ready().then(() => {
      this.store.ui.setTheme().then(() => {
        SplashScreen.hide()
      })
    })
  }
}
