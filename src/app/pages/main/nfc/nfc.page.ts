import { ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { NFC, Ndef } from '@awesome-cordova-plugins/nfc/ngx'
import { Store } from '../../../stores/store'
import { Tag } from '../../../functions/types'

@Component({
  selector: 'app-nfc',
  templateUrl: './nfc.page.html',
  styleUrls: ['./nfc.page.scss'],
})
export class NfcPage implements OnInit {
  tag: Tag
  toast: HTMLIonToastElement

  constructor(
    private changeDetectionRef: ChangeDetectorRef,
    private nfc: NFC,
    private ndef: Ndef,
    private store: Store
  ) {}

  toHexString(byteArray) {
    return Array.from(byteArray, (byte: number) => {
      // eslint-disable-next-line no-bitwise
      return ('0' + (byte & 0xff).toString(16)).slice(-2)
    }).join('')
  }

  ngOnInit() {
    // Read NFC Tag - Android
    // Once the reader mode is enabled, any tags that are scanned are sent to the subscriber
    // eslint-disable-next-line no-bitwise
    const flags = this.nfc.FLAG_READER_NFC_A | this.nfc.FLAG_READER_NFC_V
    this.nfc.readerMode(flags).subscribe(
      (tag) => {
        this.store.ui.openToast('Tag scanned', 'Close', 1000)
        this.getTag(this.toHexString(tag.id))
      },
      (err) => {
        this.store.ui.openToast('Error: ' + err, null, null).then((toast) => {
          this.toast = toast
        })
      }
    )
    // If event ID matches tagId, update tag in memory
    this.store.ui.socket.on('create rfid', (s) => {
      if (s.tagId === this.tag?.tagId) {
        this.getTag()
      }
    })
    this.store.ui.socket.on('patch rfid', (s) => {
      if (s.tagId === this.tag?.tagId) {
        this.getTag()
      }
    })
  }

  onClick() {}

  ionViewWillEnter() {
    this.getTag()
  }

  getTag(tagId = this.tag?.tagId) {
    if (tagId) {
      this.store.rfid.get(tagId).subscribe((res) => {
        if (res) {
          this.tag = res
        } else {
          this.tag = { tagId }
        }
        this.changeDetectionRef.detectChanges()
      })
    }
  }

  updateTag(user) {
    this.tag.user = user
    if (this.tag?._id) {
      this.store.rfid.patch(this.tag.tagId, this.tag).subscribe()
    } else {
      this.store.rfid.create(this.tag).subscribe()
    }
  }

  ionViewWillLeave() {
    return this.toast?.dismiss()
  }
}
