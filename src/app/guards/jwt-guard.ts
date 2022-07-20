import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router'
import { Store } from '../stores/store'
import { getToken, removeTokens } from '../functions/local-storage'

@Injectable({
  providedIn: 'root',
})
export class JwtGuard implements CanActivate {
  constructor(private router: Router, private store: Store) {}

  canActivate(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (getToken()) {
      return true
    } else {
      this.store.ui.openToast('Please log in to access this resource')
      removeTokens()
      this.router.navigate(['/auth'])
      return false
    }
  }
}
