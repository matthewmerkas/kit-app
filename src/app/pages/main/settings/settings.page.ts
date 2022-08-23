import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, Validators } from '@angular/forms'
import { passwordMatchValidator } from '../../../functions/forms'
import { Store } from '../../../stores/store'
import * as equal from 'fast-deep-equal/es6'
import { Avatar } from '../../../functions/types'

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  avatar: Avatar
  hasChanged = false
  themeForm = new FormControl()
  userCopy
  userForm = this.fb.group(
    {
      username: ['', Validators.required],
      avatarFileName: [''],
      displayName: ['', Validators.required],
      password: ['', [Validators.minLength(8)]],
      passwordConfirm: [''],
    },
    { validators: passwordMatchValidator }
  )

  constructor(private fb: FormBuilder, public store: Store) {}

  async ngOnInit() {
    this.themeForm.setValue(this.store.ui.theme)
    this.themeForm.valueChanges.subscribe((value) => {
      this.store.ui.setTheme(value)
    })
    if (!this.store.user.me) {
      await this.store.user.getMe().subscribe()
    }
    this.userForm.patchValue(this.store.user.me)
    this.userForm.get('password').reset('')
    this.userForm.valueChanges.subscribe(() => {
      this.hasChanged = !equal(this.userCopy, this.userForm.getRawValue())
    })
    this.userCopy = this.userForm.getRawValue()
  }

  isDisabled() {
    return (
      this.userForm.invalid ||
      (!this.hasChanged && !this.avatar) ||
      this.store.ui.isLoading()
    )
  }

  submit() {
    const data = this.userForm.getRawValue()
    if (!data.password) {
      delete data.password
    }
    delete data.passwordConfirm
    data.avatar = this.avatar

    this.store.user.updateMe(data).subscribe((res) => {
      this.userForm.patchValue(res)

      this.avatar = undefined
      this.hasChanged = false
      this.userCopy = this.userForm.getRawValue()
    })
  }
}
