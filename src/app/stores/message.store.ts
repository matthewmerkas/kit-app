import { BaseStore } from './base.store'
import { action, observable } from 'mobx-angular'
import { map, Observable } from 'rxjs'
import { apiConfig } from '../../environments/api.config'
import { Message } from '../functions/types'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { getItem, setItem } from '../functions/local-storage'

export class MessageStore extends BaseStore {
  @observable latestArray: Message[] = getItem('latest_array') ?? []

  constructor(http: HttpClient) {
    super(environment.apiConfig.message.base, http)
  }

  @action
  getLatest(): Observable<any> {
    return this.http.get<any>(this.url + apiConfig.message.latest).pipe(
      map((data: Message[]) => {
        setItem('latest_array', data)
        this.latestArray = data
        return data
      })
    )
  }
}
