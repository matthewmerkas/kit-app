import { Injectable } from '@angular/core'
import { observable } from 'mobx-angular'
import { HttpClient } from '@angular/common/http'
import { BaseStore } from './base.store'
import { apiConfig } from '../../environments/api.config'
import { UserStore } from './user.store'
import { InfoStore } from './info.store'
import UiStore from './ui.store'
import { ToastController } from '@ionic/angular'

@Injectable({
  providedIn: 'root',
})
export class Store {
  @observable info: InfoStore
  @observable message: BaseStore
  @observable ui: UiStore
  @observable user: UserStore

  constructor(
    private http: HttpClient,
    private toastController: ToastController
  ) {
    this.info = new InfoStore(http)
    this.message = new BaseStore(apiConfig.message, http)
    this.ui = new UiStore(toastController)
    this.user = new UserStore(apiConfig.user.base, http)
  }
}
