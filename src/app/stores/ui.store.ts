import { action, observable } from 'mobx-angular'
import { ToastController } from '@ionic/angular'

export class UiStore {
  @observable audioRefs: HTMLAudioElement[] = []
  @observable loading = false
  audioRef: HTMLAudioElement
  count = 0
  toast: HTMLIonToastElement

  constructor(private toastController: ToastController) {}

  @action
  addAudio(audioRef: HTMLAudioElement) {
    this.pauseAudio()
    this.audioRef = audioRef
    return this.audioRefs.push(audioRef) - 1
  }

  @action
  playAudio(index: number) {
    this.pauseAudio()
    if (index < this.audioRefs.length) {
      this.audioRef = this.audioRefs[index]
      if (!this.audioRef.ended && this.audioRef.readyState < 4) {
        this.audioRef.oncanplaythrough = () => {
          this.audioRef.play()
        }
      } else {
        this.audioRef.play()
      }
    }
  }

  @action
  pauseAudio(index?: number) {
    const audioRef = this.audioRefs[index] || this.audioRef
    if (audioRef) {
      if (!audioRef.ended && audioRef.readyState < 4) {
        audioRef.oncanplaythrough = () => {}
      } else {
        audioRef.pause()
      }
    }
  }

  @action
  isLoading() {
    for (const audioRef of this.audioRefs) {
      if (!audioRef.ended && audioRef.readyState < 4) {
        return true
      }
    }
    return this.loading
  }

  @action
  setLoading(loading: boolean) {
    if (loading) {
      this.count++
    } else {
      this.count--
    }
    if (this.count < 0) {
      this.count = 0
    }
    this.loading = this.count > 0
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
