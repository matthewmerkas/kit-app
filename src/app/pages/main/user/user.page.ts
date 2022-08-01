import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Message, User } from '../../../functions/types'
import { Store } from '../../../stores/store'
import { animations } from '../../../functions/animations'
import { Platform } from '@ionic/angular'
import { RecordingData, VoiceRecorder } from 'capacitor-voice-recorder'
import { DateTime } from 'luxon'
import { map } from 'rxjs'
import { catchError } from 'rxjs/operators'

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
  animations: [animations(), animations('150ms', '1s')],
})
export class UserPage implements OnInit {
  public canPause = false
  public countdown: string
  public isRecording = false
  public messages: Message[] = []
  public status = 'ready'
  public user: User

  private audioRef: HTMLAudioElement
  private audioIndex: number
  private start
  private end
  private interval
  private timeout

  private recordingData: RecordingData

  constructor(
    private activatedRoute: ActivatedRoute,
    private platform: Platform,
    private store: Store
  ) {}

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id')
    this.store.user.get(id).subscribe((res) => {
      this.user = res
    })
    this.store.message.getList({ peerId: id }).subscribe((res) => {
      this.messages = res
    })
  }

  ionViewWillLeave() {
    this.store.ui.pauseAudio()
    this.store.ui.audioRefs = []
  }

  getFabIcon = () => {
    switch (this.status) {
      case 'ready':
        return 'add'
      case 'recording':
      case 'stopping':
        return 'stop'
      case 'recorded':
      case 'sending':
        return 'paper-plane-outline'
    }
  }

  getPlayIcon = () => {
    if (this.audioRef?.paused === false) {
      return 'pause'
    }
    return 'play'
  }

  getStatusMessage = () => {
    switch (this.status) {
      case 'ready':
        return 'Record a new message'
      case 'recording':
      case 'stopping':
        return this.countdown ?? '--:--'
      case 'recorded':
        return 'Send recording?'
      case 'sending':
        return 'Sending...'
    }
  }

  isDisabled = () => {
    return (
      (this.status === 'recording' && !this.canPause) ||
      this.status === 'stopping' ||
      this.status === 'sending'
    )
  }

  onFabClick = () => {
    switch (this.status) {
      case 'ready':
        return this.startRecording()
      case 'recording':
        return this.stopRecording()
      case 'recorded':
        return this.send()
    }
  }

  async send() {
    this.status = 'sending'
    if (!this.store.user.me) {
      await this.store.user.getMe().subscribe()
    }
    const data = {
      // eslint-disable-next-line no-underscore-dangle
      userId: this.store.user.me._id,
      // eslint-disable-next-line no-underscore-dangle
      peerId: this.user._id,
      audio: this.recordingData.value,
    }
    this.store.message
      .create(data)
      .pipe(
        map((res) => {
          this.status = 'ready'
          this.messages.push(res)
          return res
        }),
        catchError((err) => {
          this.status = 'recorded'
          return err
        })
      )
      .subscribe()
  }

  startCountdown() {
    const diff = DateTime.now().diff(this.start)

    this.timeout = setTimeout(() => {
      this.canPause = true
      this.countdown = diff.plus(1000).toFormat('mm:ss')
      this.interval = setInterval(() => {
        this.countdown = DateTime.now().diff(this.start).toFormat('mm:ss')
      }, 1000)
    }, 1000 - (diff % 1000))
  }

  async startRecording() {
    this.status = 'recording'
    this.store.ui.pauseAudio()
    this.audioRef = null
    this.recordingData = null
    await VoiceRecorder.requestAudioRecordingPermission()
    VoiceRecorder.startRecording()
    this.start = DateTime.now()
    this.countdown = '00:00'
    this.startCountdown()
    this.isRecording = true
  }

  async pauseRecording() {
    VoiceRecorder.pauseRecording()
    this.end = DateTime.now()
    this.isRecording = false
    clearInterval(this.interval)
    clearTimeout(this.timeout)
  }

  async resumeRecording() {
    VoiceRecorder.resumeRecording()
    this.start = DateTime.now().plus(this.start.diff(this.end))
    this.startCountdown()
    this.isRecording = true
  }

  stopRecording() {
    this.status = 'stopping'
    VoiceRecorder.stopRecording().then((res) => {
      this.status = 'recorded'
      this.canPause = false
      this.recordingData = res
    })
    this.countdown = null
    clearInterval(this.interval)
  }

  deleteRecording() {
    this.recordingData = null
    this.status = 'ready'
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

  startPlayback() {
    const base64Sound = this.recordingData.value.recordDataBase64
    const mimeType = this.recordingData.value.mimeType
    this.audioRef = new Audio(`data:${mimeType};base64,${base64Sound}`)
    this.audioIndex = this.store.ui.addAudio(this.audioRef)
    this.audioRef.oncanplaythrough = () => this.audioRef.play()
    this.audioRef.load()
    this.audioRef.onended = () => {
      this.getPlayIcon()
    }
  }

  pausePlayback() {
    this.store.ui.pauseAudio(this.audioIndex)
  }

  resumePlayback() {
    this.store.ui.playAudio(this.audioIndex)
  }
}
