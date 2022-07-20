import { action, observable } from 'mobx-angular'
import { ToastController } from '@ionic/angular'

export class UiStore {
  @observable loading = false
  toast: HTMLIonToastElement

  constructor(private toastController: ToastController) {}

  @action
  setLoading(loading: boolean) {
    this.loading = loading
  }

  async openToast(message?: string, text = 'Close', duration = 3000) {
    if (message) {
      await this.toast?.dismiss()
      this.toast = await this.toastController.create({
        message,
        duration,
        buttons: [
          {
            text,
            role: 'cancel',
          },
        ],
        cssClass: 'toast',
      })
      await this.toast.present()
    }
  }
}

export default UiStore
