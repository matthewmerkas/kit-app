import { Injectable } from '@angular/core'
import { observable } from 'mobx-angular'
import { HttpClient } from '@angular/common/http'
import { UserStore } from './user.store'
import { InfoStore } from './info.store'
import UiStore from './ui.store'
import { AlertController, ToastController } from '@ionic/angular'
import { MessageStore } from './message.store'
import { BaseStore } from './base.store'
import { environment } from '../../environments/environment'
import { Router } from '@angular/router'
import { NicknameStore } from './nickname.store'

@Injectable({
  providedIn: 'root',
})
export class Store {
  @observable info: InfoStore
  @observable message: MessageStore
  @observable nickname: NicknameStore
  @observable rfid: BaseStore
  @observable ui: UiStore
  @observable user: UserStore

  constructor(
    private alertController: AlertController,
    private http: HttpClient,
    private router: Router,
    private toastController: ToastController
  ) {
    this.initialise()
  }

  initialise() {
    this.info = new InfoStore(this.http)
    this.message = new MessageStore(this.http)
    this.nickname = new NicknameStore(this.http, this)
    this.rfid = new BaseStore(environment.apiConfig.rfid, this.http)
    this.ui = new UiStore(this.alertController, this.toastController)
    this.user = new UserStore(this.http, this.router, this)
  }
}
