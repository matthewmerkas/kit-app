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
  public status = 'waiting'
  public isPlaying = false
  public user: User
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

  onClick = () => {
    switch (this.status) {
      case 'waiting':
        return this.startRecord()
      case 'recording':
        return this.stopRecord()
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

  async startRecord() {
    this.status = 'recording'
    await VoiceRecorder.requestAudioRecordingPermission()
    await VoiceRecorder.startRecording()
    this.countdown = '00:00'
    const start = DateTime.now()
    this.timeout = setInterval(() => {
      this.countdown = DateTime.now().diff(start).toFormat('mm:ss')
    }, 1000)
  }

  stopRecord() {
    this.status = 'stopping'
    clearInterval(this.timeout)
    this.countdown = null
    VoiceRecorder.stopRecording().then((res) => {
      this.status = 'recorded'
      console.log(res)
    })
  }
}
