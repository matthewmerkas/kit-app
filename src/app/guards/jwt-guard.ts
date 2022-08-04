import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router'
import { getToken, removeTokens } from '../functions/local-storage'

@Injectable({
  providedIn: 'root',
})
export class JwtGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (getToken()) {
      return true
    } else {
      removeTokens()
      this.router.navigate(['/auth'])
      return false
    }
  }
}
