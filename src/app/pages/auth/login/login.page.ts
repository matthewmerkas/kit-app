import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { FormBuilder, Validators } from '@angular/forms'
import { passwordMatchValidator } from '../../../functions/forms'
import { Store } from '../../../stores/store'
import { forkJoin } from 'rxjs'
import { getToken, removeTokens } from '../../../functions/local-storage'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  showPassword = false
  showConfirmPassword = false
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
    if (getToken()) {
      this.login()
    } else {
      removeTokens()
      this.store.initialise() // Clear stores
      this.loginForm.reset()
      this.signupForm.reset()
      this.showPassword = false
      this.showConfirmPassword = false
      this.signup = this.route.snapshot.queryParamMap.get('signup') === 'true'
    }
  }

  login = () => {
    forkJoin([
      this.store.message.getLatest(),
      this.store.user.getMe(),
    ]).subscribe(() => {
      this.router.navigate(['/home'])
    })
  }

  showMatchError = () => {
    const mismatch = this.signupForm.errors?.mismatch === true
    if (mismatch) {
      this.signupForm.controls.passwordConfirm.setErrors({ mismatch })
    }
    return mismatch
  }

  submit = () => {
    if (this.signup) {
      this.store.user.signup(this.signupForm.getRawValue()).subscribe((res) => {
        this.loginForm.patchValue({ username: res.username })
        this.store.ui.openToast('Account created!')
        this.toggleSignup()
        this.signupForm.reset()
      })
    } else {
      this.store.user.login(this.loginForm.getRawValue()).subscribe(() => {
        this.login()
      })
    }
  }

  toggleSignup = () => {
    this.signup = !this.signup
    this.showPassword = false
    this.showConfirmPassword = false
    this.router.navigate([], { queryParams: { signup: this.signup } })
  }
}
