import { Component, Input, OnInit } from '@angular/core'
import { FormGroup } from '@angular/forms'

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  @Input() fullForm: FormGroup
  @Input() loginForm: FormGroup
  @Input() submit: () => void

  _full = false
  showPassword = false
  showConfirmPassword = false

  constructor() {}

  @Input() set full(value: boolean) {
    // eslint-disable-next-line no-underscore-dangle
    this._full = value
    this.showPassword = false
    this.showConfirmPassword = false
  }

  ngOnInit() {
    this.showPassword = false
    this.showConfirmPassword = false
  }

  showMatchError = () => {
    const mismatch = this.fullForm.errors?.mismatch === true
    if (mismatch) {
      this.fullForm.controls.passwordConfirm.setErrors({ mismatch })
    }
    return mismatch
  }
}
