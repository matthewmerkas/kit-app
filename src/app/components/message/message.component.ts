import { Component, OnInit, Input } from '@angular/core'
import { formatDatetime } from 'src/app/functions/datetime'
import { Message, User } from '../../functions/types'
import { Store } from '../../stores/store'
import { animations } from '../../functions/animations'
import { environment } from '../../../environments/environment'
import { scheduleNotification } from '../../functions/push-notifications'

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  animations: animations(),
})
export class MessageComponent implements OnInit {
  @Input() message: Message
  @Input() peer: User

  public moving = false
  private audioRef: HTMLAudioElement
  private audioIndex: number

  constructor(public store: Store) {}

  ngOnInit() {}

  formatDatetime(iso: string) {
    return formatDatetime(iso)
  }

  getColor() {
    if (
      window.matchMedia('(prefers-color-scheme: dark') ||
      document.body.classList.contains('dark')
    ) {
      return this.message.direction === 'send' ? 'light' : 'dark'
    }
    return 'dark'
  }

  getPlayIcon = () => {
    if (this.audioRef?.paused === false) {
      return 'pause'
    }
    return 'play'
  }

  getCurrentTime = () => {
    return this.audioRef?.currentTime * 1000
  }

  getDuration = () => {
    return this.message.duration
  }

  getTimeString = () => {
    const formatTime = (int: number) => {
      if (isNaN(int) || int === Infinity) {
        return '--:--'
      } else if (int === 0) {
        return '00:00'
      } else {
        return `${String(Math.floor(int / 60)).padStart(2, '0')}:${String(
          Math.floor(int % 60)
        ).padStart(2, '0')}`
      }
    }
    if (this.audioRef) {
      return formatTime(this.audioRef.currentTime)
    } else {
      return formatTime(this.message.duration / 1000)
    }
  }

  isRangeDisabled = () => {
    return !(this.audioRef?.paused === false || this.moving)
  }

  onPlayClick = () => {
    if (!this.audioRef) {
      this.startPlayback()
    } else if (this.audioRef.paused) {
      this.store.ui.playAudio(this.audioIndex)
    } else {
      this.store.ui.pauseAudio(this.audioIndex)
    }
  }

  onKnobMoveStart = () => {
    this.moving = true
    this.store.ui.pauseAudio(this.audioIndex)
  }

  onKnobMoveEnd = (e) => {
    this.moving = false
    const time = e.detail.value / 1000
    if (this.audioRef == null) {
      this.startPlayback(time)
    } else {
      this.store.ui.playAudio(this.audioIndex, time)
    }
  }

  startPlayback(startAt = 0) {
    this.audioRef = new Audio(
      environment.apiUrl.replace('/api', '/public/audio/') +
        this.message.audioFileName
    )
    this.audioIndex = this.store.ui.addAudio(this.audioRef)
    this.audioRef.currentTime = startAt
    this.audioRef.ontimeupdate = async (e) => {
      if (
        (e.target as HTMLAudioElement).currentTime >= 1 &&
        this.message.direction === 'receive' &&
        !(this.message.currentTime >= 1000)
      ) {
        this.message.currentTime = 1000
        this.store.message
          .patch(this.message._id, { currentTime: 1000 })
          .subscribe()
        await scheduleNotification(this.peer)
        this.audioRef.ontimeupdate = () => {}
      }
    }
    this.audioRef.oncanplaythrough = () => this.audioRef.play()
    this.audioRef.load()
  }
}
