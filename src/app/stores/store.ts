import { Injectable } from '@angular/core'
import { observable } from 'mobx-angular'
import { HttpClient } from '@angular/common/http'
import { UserStore } from './user.store'
import { InfoStore } from './info.store'
import UiStore from './ui.store'
import { ToastController } from '@ionic/angular'
import { MessageStore } from './message.store'

@Injectable({
  providedIn: 'root',
})
export class Store {
  @observable info: InfoStore
  @observable message: MessageStore
  @observable ui: UiStore
  @observable user: UserStore

  constructor(
    private http: HttpClient,
    private toastController: ToastController
  ) {
    this.initialise()
  }

  initialise() {
    this.info = new InfoStore(this.http)
    this.message = new MessageStore(this.http)
    this.ui = new UiStore(this.toastController)
    this.user = new UserStore(this.http)
  }
}
