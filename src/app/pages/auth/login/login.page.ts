import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { FormBuilder, Validators } from '@angular/forms'
import { passwordMatchValidator } from '../../../functions/form-helpers'

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
    password: ['', Validators.required],
  })
  signupForm = this.fb.group(
    {
      username: ['', Validators.required],
      displayName: ['', Validators.required],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required],
    },
    { validators: passwordMatchValidator }
  )

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.signup = this.route.snapshot.queryParamMap.get('signup') === 'true'
  }

  toggleSignup = () => {
    this.signup = !this.signup
    this.router.navigate([], { queryParams: { signup: this.signup } })
  }
}
