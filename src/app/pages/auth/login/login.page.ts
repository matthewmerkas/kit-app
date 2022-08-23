import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { FormBuilder, Validators } from '@angular/forms'
import { passwordMatchValidator } from '../../../functions/forms'
import { Store } from '../../../stores/store'
import { forkJoin } from 'rxjs'
import { removeTokens } from '../../../functions/local-storage'
import { Avatar } from '../../../functions/types'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  avatar: Avatar
  signup = false

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]],
  })
  signupForm = this.fb.group(
    {
      username: ['', Validators.required],
      displayName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirm: ['', Validators.required],
    },
    { validators: passwordMatchValidator }
  )

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit() {
    removeTokens()
    this.store.initialise() // Clear stores
    this.reset()
    this.signup = this.route.snapshot.queryParamMap.get('signup') === 'true'
  }

  reset = () => {
    this.avatar = null
    this.loginForm.reset()
    this.signupForm.reset()
  }

  submit = () => {
    if (this.signup) {
      const data = this.signupForm.getRawValue()
      data.avatar = this.avatar
      this.store.user.signup(data).subscribe((res) => {
        this.loginForm.patchValue({ username: res.username })
        this.store.ui.openToast('Account created!')
        this.toggleSignup()
        this.signupForm.reset()
      })
    } else {
      this.store.user.login(this.loginForm.getRawValue()).subscribe(() => {
        forkJoin([
          this.store.message.getLatest(),
          this.store.user.getMe(),
        ]).subscribe(() => {
          this.reset()
          this.router.navigate(['/home'])
        })
      })
    }
  }

  toggleSignup = () => {
    this.signup = !this.signup
    this.router.navigate([], { queryParams: { signup: this.signup } })
  }
}
