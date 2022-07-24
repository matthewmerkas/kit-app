import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { User } from '../../../functions/types'
import { Store } from '../../../stores/store'
import { animations } from '../../../functions/animations'
import { Platform } from '@ionic/angular'
import { VoiceRecorder } from 'capacitor-voice-recorder'
import { DateTime } from 'luxon'

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
  animations: animations(),
})
export class UserPage implements OnInit {
  public countdown: string
  public isPlaying = false
  public isRecording = false
  public status = 'waiting'
  public user: User

  private start
  private end
  private interval
  private timeout

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
  }

  getIcon = () => {
    switch (this.status) {
      case 'waiting':
        return 'add'
      case 'recording':
      case 'stopping':
        return 'stop'
      case 'recorded':
      case 'sending':
        return 'paper-plane-outline'
    }
  }

  getStatusMessage = () => {
    switch (this.status) {
      case 'waiting':
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
    return this.status === 'stopping' || this.status === 'sending'
  }

  onFabClick = () => {
    switch (this.status) {
      case 'waiting':
        return this.startRecording()
      case 'recording':
        return this.stopRecording()
      case 'recorded':
        return this.send()
    }
  }

  send() {
    this.status = 'sending'
    const date = new Date().toISOString()
    const rand = Math.random().toString(16).substr(2, 8)
    const fileName = `message_${date}_${rand}`
    console.log(fileName)
    // TODO: Create and upload message object to backend
    this.status = 'waiting'
  }

  startCountdown() {
    const diff = DateTime.now().diff(this.start)

    this.timeout = setTimeout(() => {
      this.countdown = diff.plus(1000).toFormat('mm:ss')
      this.interval = setInterval(() => {
        this.countdown = DateTime.now().diff(this.start).toFormat('mm:ss')
      }, 1000)
    }, 1000 - (diff % 1000))
  }

  async startRecording() {
    this.status = 'recording'
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
      console.log(res)
    })
    this.countdown = null
    clearInterval(this.interval)
  }
}
