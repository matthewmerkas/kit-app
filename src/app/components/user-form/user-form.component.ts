import { Component, Input, OnInit } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { Store } from '../../stores/store'

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  @Input() fullForm: FormGroup
  @Input() loginForm: FormGroup
  @Input() submit: () => void

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
  }

  showMatchError = () => {
    const mismatch = this.fullForm.errors?.mismatch === true
    if (mismatch) {
      this.fullForm.controls.passwordConfirm.setErrors({ mismatch })
    }
    return mismatch
  }
}
