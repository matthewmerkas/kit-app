import { Component, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { User } from '../../../functions/types'
import { Store } from '../../../stores/store'
import { animations } from '../../../functions/animations'
import { RecordingData, VoiceRecorder } from 'capacitor-voice-recorder'
import { DateTime } from 'luxon'
import { map } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { CdkScrollable } from '@angular/cdk/overlay'
import { Platform } from '@ionic/angular'
import { getItem, getToken, setItem } from '../../../functions/local-storage'

@Component({
  selector: 'app-peer',
  templateUrl: './peer.page.html',
  styleUrls: ['./peer.page.scss'],
  animations: [animations(), animations('150ms', '1s')],
})
export class PeerPage implements OnInit {
  @ViewChild('cdkScrollable', { static: false }) cdkScrollable: CdkScrollable

  public canPause = false
  public countdown: string
  public id: string
  public isRecording = false
  public loading = true
  public showLabel = false
  public status = 'ready'
  public peer: User

  private audioRef: HTMLAudioElement
  private audioIndex: number
  private start
  private end
  private interval
  private timeout

  private recordingData: RecordingData

  constructor(
    private activatedRoute: ActivatedRoute,
    public platform: Platform,
    public store: Store
  ) {}

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id')
    this.platform.resume.subscribe(() => {
      if (getToken()) {
        this.store.message.getList(this.id).subscribe()
      }
    })
    this.store.user.get(this.id).subscribe((res) => {
      this.peer = res
    })
    this.store.message.arrayEvent.subscribe(() => {
      this.scrollToBottom()
    })
    this.store.message.getList(this.id).subscribe(() => {
      this.scrollToBottom(true)
      this.loading = false
    })
    if (!getItem('profile_label_shown')) {
      this.showLabel = true
    }
  }

  ionViewWillEnter() {
    this.scrollToBottom(true)
  }

  ionViewWillLeave() {
    if (this.status === 'recording') {
      this.stopRecording()
    }
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

  onProfileClick = () => {
    setItem('profile_label_shown', true)
    this.showLabel = false
  }

  scrollToBottom(force = false) {
    if (force || this.cdkScrollable.measureScrollOffset('bottom') < 200) {
      setTimeout(() => {
        this.cdkScrollable.scrollTo({ bottom: 0 })
      }, 0)
    }
  }

  async send() {
    this.status = 'sending'
    this.store.ui.pauseAudio()
    if (!this.store.user.me) {
      await this.store.user.getMe().subscribe()
    }
    const data = {
      user: this.store.user.me._id,
      peer: this.peer._id,
      audio: this.recordingData.value,
    }
    this.store.message
      .create(data)
      .pipe(
        map((res) => {
          this.status = 'ready'
          this.store.message.push({ ...res, peer: this.peer })
          this.scrollToBottom(true)
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
    this.store.ui.pauseAudio()
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
