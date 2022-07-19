import { FormGroup } from '@angular/forms'

export const passwordMatchValidator = (g: FormGroup): any => {
  return g.get('password')?.value === g.get('passwordConfirm')?.value
    ? null
    : { mismatch: true }
}
