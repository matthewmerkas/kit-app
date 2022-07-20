import { Component } from '@angular/core'
import { Platform } from '@ionic/angular'
import { animations } from './functions/animations'
import { Store } from './stores/store'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  animations: animations('150ms', '1s'),
})
export class AppComponent {
  constructor(public store: Store, public platform: Platform) {
    store.info.get().subscribe()
  }
}
