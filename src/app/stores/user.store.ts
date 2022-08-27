import { BaseStore } from './base.store'
import { action, observable } from 'mobx-angular'
import { map, Observable } from 'rxjs'
import { apiConfig } from '../../environments/api.config'
import { Jwt, User } from '../functions/types'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { getItem, removeTokens, setItem } from '../functions/local-storage'
import { catchError } from 'rxjs/operators'
import { Store } from './store'
import { Router } from '@angular/router'

export class UserStore extends BaseStore {
  @observable me: User = {}
  router: Router
  store: Store

  constructor(http: HttpClient, router: Router, store: Store) {
    super(environment.apiConfig.user.base, http)
    this.me = getItem('me')
    this.router = router
    this.store = store
  }

  @action
  getMe(): Observable<any> {
    return this.http.get<any>(this.url + apiConfig.user.me).pipe(
      map((res: User) => {
        setItem('me', res)
        this.me = res
        return res
      }),
      catchError((err) => {
        if (err.error.message === 'Could not find User') {
          this.store.ui.openAlert(
            err.error.message,
            '',
            'This account may have been deleted. Try logging-in again',
            [
              {
                text: 'Log In',
                role: 'cancel',
                handler: () => {
                  removeTokens()
                  return this.router.navigate(['/auth/login'])
                },
              },
            ]
          )
        }
        return err
      })
    )
  }

  // Patches user in the backend
  @action
  updateMe(data: User): Observable<any> {
    return this.http.put<any>(this.url + apiConfig.user.me, data).pipe(
      map((res: User) => {
        setItem('me', res)
        this.updateArray(res)
        this.me = res
        return res
      })
    )
  }

  @action
  login(data: any, storeTokens = true): Observable<any> {
    return this.http.post<any>(this.url + apiConfig.user.login, data).pipe(
      map((res: Jwt) => {
        if (storeTokens) {
          localStorage.setItem('access_token', res.token)
          localStorage.setItem('refresh_token', res.refreshToken)
        }
        return res
      })
    )
  }

  @action
  refresh(data: any): Observable<any> {
    return this.http.post<any>(this.url + apiConfig.user.refresh, data).pipe(
      map((res: Jwt) => {
        localStorage.setItem('access_token', res.token)
        return res
      })
    )
  }

  @action
  signup(data: any): Observable<any> {
    return this.http.post<any>(this.url + apiConfig.user.signup, data).pipe(
      map((res) => {
        return res
      })
    )
  }
}
