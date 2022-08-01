import { Component, OnInit, Input } from '@angular/core'
import { formatDatetime } from 'src/app/functions/datetime'
import { Message } from '../../functions/types'
import { Store } from '../../stores/store'
import { animations } from '../../functions/animations'
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  animations: animations(),
})
export class MessageComponent implements OnInit {
  @Input() message: Message

  private audioRef: HTMLAudioElement
  private audioIndex: number

  constructor(public store: Store) {}

  ngOnInit() {}

  formatDatetime(iso: string) {
    return formatDatetime(iso)
  }

  getColor() {
    return this.message.direction === 'send' ? 'light' : 'dark'
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

  onPlayClick = () => {
    if (!this.audioRef) {
      this.startPlayback()
    } else if (this.audioRef.paused) {
      this.resumePlayback()
    } else {
      this.pausePlayback()
    }
  }

  onKnobMoveEnd = (e) => {
    const time = e.detail.value / 1000
    if (this.audioRef == null) {
      this.startPlayback(time)
    } else {
      this.audioRef.currentTime = time
    }
  }

  startPlayback(startAt = 0) {
    this.audioRef = new Audio(
      environment.apiUrl.replace('/api', '') + this.message.audioUrl
    )
    this.audioIndex = this.store.ui.addAudio(this.audioRef)
    this.audioRef.currentTime = startAt
    this.audioRef.ontimeupdate = () => {}
    this.audioRef.oncanplaythrough = () => this.audioRef.play()
    this.audioRef.load()
  }

  pausePlayback() {
    this.store.ui.pauseAudio(this.audioIndex)
  }

  resumePlayback() {
    this.store.ui.playAudio(this.audioIndex)
  }
}
