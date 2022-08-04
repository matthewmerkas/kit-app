import { action, observable } from 'mobx-angular'
import { ToastController } from '@ionic/angular'
import { App } from '@capacitor/app'

export class UiStore {
  @observable audioRefs: HTMLAudioElement[] = []

  private audioRef: HTMLAudioElement
  private count = 0
  private exit = false
  private exitTimeout
  private loading = false
  private toast: HTMLIonToastElement

  constructor(private toastController: ToastController) {}

  @action
  addAudio(audioRef: HTMLAudioElement) {
    this.pauseAudio()
    this.audioRef = audioRef
    return this.audioRefs.push(audioRef) - 1
  }

  @action
  playAudio(index: number, time?: number) {
    this.pauseAudio()
    if (index < this.audioRefs.length) {
      this.audioRef = this.audioRefs[index]
      if (time != null) {
        this.audioRef.currentTime = time
      }
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

  @action
  setExit(value: boolean) {
    if (this.exit && value) {
      App.exitApp()
    }

    this.exit = value
    if (value) {
      this.openToast('Press again to exit', '')
      this.exitTimeout = setTimeout(() => {
        this.exit = false
      }, 3000)
    } else {
      clearTimeout(this.exitTimeout)
    }
  }

  async openToast(message?: string, text = 'Close', duration = 3000) {
    if (message) {
      await this.toast?.dismiss()
      const config: any = {
        message,
        duration,
        buttons: text
          ? [
              {
                text,
                role: 'cancel',
              },
            ]
          : [],
        cssClass: 'toast',
      }
      this.toast = await this.toastController.create(config)
      await this.toast.present()
    }
  }
}

export default UiStore
