import { action, observable } from 'mobx-angular'
import { map, Observable } from 'rxjs'
import { apiConfig } from '../../environments/api.config'
import { Message } from '../functions/types'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { getItem, getMap, setItem, setMap } from '../functions/local-storage'

const key = 'message_map'
const keyLatest = 'message_latest'
const url = environment.apiUrl + environment.apiConfig.message.base

export class MessageStore {
  @observable array: Message[] = []
  @observable id: string
  @observable latest: Message[] = getItem(keyLatest) ?? []
  @observable map: Map<string, Message[]>

  constructor(public http: HttpClient) {
    this.map = getMap(key) ?? new Map()
  }

  @action
  create(data: any): Observable<any> {
    return this.http.post<any>(url, data)
  }

  @action
  get(id: string): Observable<any> {
    return this.http.get<any>(url + '/' + id)
  }

  @action
  getLatest(): Observable<any> {
    return this.http.get<any>(url + apiConfig.message.latest).pipe(
      map((data: Message[]) => {
        setItem(keyLatest, data)
        this.latest = data
        return data
      })
    )
  }

  // Updates existing array with new messages
  @action
  getList(peer: string): Observable<any> {
    const messages = this.map.get(peer) ?? []
    this.array = messages
    this.id = peer

    const filter: any = { peer }
    const length = messages?.length
    if (length > 0) {
      filter.createdAt = JSON.stringify({ $gt: messages[length - 1].createdAt })
    }
    const queryParams = new URLSearchParams(filter)

    return this.http.get<any>(url + '?' + queryParams).pipe(
      map((data: Message[]) => {
        messages.push(...data)
        this.array = messages
        this.map.set(filter.peer, messages)
        setMap(key, this.map)
        return messages
      })
    )
  }

  @action
  push(message: Message) {
    // Push to array
    if (this.id === message.peer._id) {
      this.array.push(message)
    }
    // Push to map
    if (typeof message.peer === 'string') {
      const messages = this.map.get(message.peer) ?? []
      messages.push(message)
      this.map.set(message.peer, messages)
      setMap(key, this.map)
    }
    // Push to latest
    for (const [i, m] of this.latest.entries()) {
      if (m.peer._id === message.peer._id) {
        this.latest.splice(i, 1)
        break
      }
    }
    this.latest.splice(0, 0, message)
  }

  @action
  update(id: string, data: any): Observable<any> {
    return this.http.put<any>(url + '/' + id, data)
  }

  @action
  delete(id: string): Observable<any> {
    return this.http.delete<any>(url + '/' + id)
  }
}
