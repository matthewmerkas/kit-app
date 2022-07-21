import { BaseStore } from './base.store'
import { action, observable } from 'mobx-angular'
import { map, Observable } from 'rxjs'
import { apiConfig } from '../../environments/api.config'
import { Jwt, User } from '../functions/types'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'

export class UserStore extends BaseStore {
  @observable me: User = {}

  constructor(http: HttpClient) {
    super(environment.apiConfig.user.base, http)
  }

  @action
  getMe(): Observable<any> {
    return this.http.get<any>(this.url + apiConfig.user.me).pipe(
      map((data: User) => {
        this.me = data
        return data
      })
    )
  }

  @action
  login(data: any): Observable<any> {
    return this.http.post<any>(this.url + apiConfig.user.login, data).pipe(
      map((res: Jwt) => {
        localStorage.setItem('access_token', res.token)
        localStorage.setItem('refresh_token', res.refreshToken)
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
