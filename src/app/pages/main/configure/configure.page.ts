import { Component, OnInit } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { Jwt, User } from '../../../functions/types'
import { Store } from '../../../stores/store'
import { getRefreshToken, getToken } from '../../../functions/local-storage'
import { JwtHelperService } from '@auth0/angular-jwt'
import { map } from 'rxjs'
import { Ndef, NFC } from '@awesome-cordova-plugins/nfc/ngx'
import { Platform } from '@ionic/angular'

const helper = new JwtHelperService()

@Component({
  selector: 'app-configure',
  templateUrl: './configure.page.html',
  styleUrls: ['./configure.page.scss'],
})
export class ConfigurePage implements OnInit {
  showPassword = false
  refreshToken: string
  sharing = false
  user: User
  userForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]],
  })
  wifiForm = this.fb.group({
    ssid: ['', Validators.required],
    password: [''],
  })

  constructor(
    private fb: FormBuilder,
    private nfc: NFC,
    private ndef: Ndef,
    public platform: Platform,
    public store: Store
  ) {}

  ngOnInit() {
    this.nfc.unshare()
    this.resetUser()
  }

  canWrite() {
    return this.wifiForm.valid && this.refreshToken
  }

  fetchJwt() {
    return this.store.user.refresh({ refreshToken: this.refreshToken }).pipe(
      map((res: Jwt) => {
        return res.token
      })
    )
  }

  getToken() {
    return getToken()
  }

  login() {
    this.store.user
      .login(this.userForm.getRawValue(), false)
      .subscribe((res: Jwt) => {
        this.refreshToken = res.refreshToken
        this.user = helper.decodeToken(res.token)
        this.userForm.reset()
      })
  }

  resetUser(clear = false) {
    if (clear) {
      this.user = null
      this.refreshToken = null
    } else {
      this.store.user.getMe().subscribe((res) => {
        this.user = res
      })
      this.refreshToken = getRefreshToken()
    }
  }

  transmit() {
    this.fetchJwt().subscribe((token: string) => {
      const mimeType = 'application/kit'
      const payload = {
        wifi: this.wifiForm.getRawValue(),
        token,
      }
      const record = this.ndef.mimeMediaRecord(
        mimeType,
        JSON.stringify(payload)
      )
      this.sharing = true
      this.nfc.addNdefListener(
        () => {
          this.nfc
            .share([record])
            .then(() => {
              this.store.ui.openToast('Configuration sent')
              this.nfc.unshare()
            })
            .catch((err) => {
              if (err === 'NDEF_PUSH_DISABLED') {
                // TODO: Open settings menu to Android Beam (or enable ourselves)
                this.store.ui.openToast('Please enable Android Beam')
              }
              console.log(err)
            })
            .finally(() => {
              this.sharing = false
            })
        },
        (err) => {
          console.log(err)
        }
      )
    })
  }
}
