import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { Store } from '../../stores/store'
import { Avatar } from '../../functions/types'

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  @Input() fullForm: FormGroup
  @Input() loginForm: FormGroup
  @Input() submit: () => void
  @Output() avatarChange = new EventEmitter<Avatar>()

  dataUrl: string
  fileName: string
  _full = true
  showPassword = false
  showConfirmPassword = false

  constructor(public store: Store) {}

  @Input() set full(value: boolean) {
    // eslint-disable-next-line no-underscore-dangle
    this._full = value
    this.showPassword = false
    this.showConfirmPassword = false
  }

  ngOnInit() {
    this.showPassword = false
    this.showConfirmPassword = false
    this.fileName = this.fullForm.get('avatarFileName')?.value
  }

  showMatchError = () => {
    const mismatch = this.fullForm.errors?.mismatch === true
    if (mismatch) {
      this.fullForm.controls.passwordConfirm.setErrors({ mismatch })
    }
    return mismatch
  }

  getPicture = async (source: 'camera' | 'photos') => {
    const image = await Camera.getPhoto({
      quality: 80,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      saveToGallery: true,
      source: source === 'camera' ? CameraSource.Camera : CameraSource.Photos,
    })
    this.dataUrl = image.dataUrl
    this.avatarChange.emit({
      base64: image.dataUrl.split(',')[1],
      // https://stackoverflow.com/a/32808869/15379768
      extension: image.dataUrl.match(/(?<=\/)(.*?)(?=;)/)[0],
    })
  }
}
