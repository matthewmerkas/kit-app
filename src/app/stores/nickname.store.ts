import { HttpClient } from '@angular/common/http'
import { map, Observable } from 'rxjs'
import { action } from 'mobx-angular'
import { environment } from '../../environments/environment'
import { Nickname } from '../functions/types'
import { Store } from './store'
import { setItem } from '../functions/local-storage'
import { keyLatest } from './message.store'

export class NicknameStore {
  url = environment.apiUrl + environment.apiConfig.nickname

  constructor(protected http: HttpClient, private store: Store) {}

  @action
  update(data: Nickname): Observable<any> {
    return this.http.post<any>(this.url, data).pipe(
      map(() => {
        const latest = this.store.message.latest
        for (const [i, message] of latest.entries()) {
          if (message.peer._id === data.peerId) {
            message.peer.nickname = data.value
            latest[i] = message
            break
          }
        }
        setItem(keyLatest, latest)

        const users = this.store.user.array
        for (const [i, user] of users.entries()) {
          if (user._id === data.peerId) {
            user.nickname = data.value
            users[i] = user
            break
          }
        }
        setItem(this.store.user.key, users)

        const me = this.store.user.me
        if (me._id === data.peerId) {
          me.nickname = data.value
          setItem('me', me)
        }
      })
    )
  }
}
