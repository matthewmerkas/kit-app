import { ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { FormBuilder, Validators } from '@angular/forms'
import { passwordMatchValidator } from '../../../functions/forms'
import { Store } from '../../../stores/store'

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
    private changeDetectionRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit() {
    this.signup = this.route.snapshot.queryParamMap.get('signup') === 'true'
  }
  submit = () => {
    if (this.signup) {
    } else {
      this.store.user.login(this.loginForm.getRawValue()).subscribe(() => {
        return this.router.navigate(['/home'])
      })
    }
  }

  toggleSignup = () => {
    this.signup = !this.signup
    this.router.navigate([], { queryParams: { signup: this.signup } })
  }
}
