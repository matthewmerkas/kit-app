import { Component, OnInit } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { passwordMatchValidator } from '../../../functions/forms'
import { Store } from '../../../stores/store'
import * as equal from 'fast-deep-equal/es6'

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  hasChanged = false
  userCopy
  userForm = this.fb.group(
    {
      username: ['', Validators.required],
      displayName: ['', Validators.required],
      password: ['', [Validators.minLength(8)]],
      passwordConfirm: [''],
    },
    { validators: passwordMatchValidator }
  )

  constructor(private fb: FormBuilder, public store: Store) {}

  ngOnInit() {
    const me = this.store.user.me
    this.userForm.patchValue({
      username: me.username,
      displayName: me.displayName,
    })
    this.userForm.valueChanges.subscribe(() => {
      this.hasChanged = !equal(this.userCopy, this.userForm.getRawValue())
    })
    this.userCopy = this.userForm.getRawValue()
  }

  submit() {
    const user = this.userForm.getRawValue()
    if (!user.password) {
      delete user.password
    }
    delete user.passwordConfirm

    this.store.user.updateMe(user).subscribe(() => {
      this.hasChanged = false
      this.userCopy = this.userForm.getRawValue()
    })
  }
}
