import { action, observable } from 'mobx-angular'
import { map, Observable } from 'rxjs'
import { apiConfig } from '../../environments/api.config'
import { Message } from '../functions/types'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { getItem, getMap, setItem, setMap } from '../functions/local-storage'
import * as equal from 'fast-deep-equal/es6'
import { EventEmitter } from '@angular/core'

export const key = 'message_map'
export const keyLatest = 'message_latest'
export const url = environment.apiUrl + environment.apiConfig.message.base

export class MessageStore {
  @observable array: Message[] = []
  @observable arrayEvent: EventEmitter<number> = new EventEmitter()
  @observable id: string
  @observable latest: Message[] = getItem(keyLatest) ?? []
  @observable map: Map<string, Message[]> = getMap(key) ?? new Map()

  constructor(public http: HttpClient) {}

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
      map((res: Message[]) => {
        if (!equal(this.latest, res)) {
          setItem(keyLatest, res)
          this.latest = res
        }
        return res
      })
    )
  }

  // Appends new messages to existing array
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
      map((res: Message[]) => {
        if (res.length > 0) {
          messages.push(...res)
          // Clone messages so we can update array and map independently
          this.array = []
          this.array.push(...messages)
          this.map.set(filter.peer, messages)
          setMap(key, this.map)
        }
        return messages
      })
    )
  }

  @action
  push(message: Message) {
    // Push to map
    const messages = this.map.get(message.peer._id) ?? []
    messages.push(message)
    this.map.set(message.peer._id, messages)
    setMap(key, this.map)
    // Push to array
    if (this.id === message.peer._id) {
      this.array = []
      this.array.push(...messages)
      this.arrayEvent.emit(this.array.length)
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
  set(id: string, data: any): Observable<any> {
    return this.http.put<any>(url + '/' + id, data).pipe(
      map((res: Message) => {
        this.updateLatest(res)
        this.updateMap(res)
      })
    )
  }

  @action
  patch(id: string, data: any): Observable<any> {
    return this.http.put<any>(url + '/' + id + '/patch', data).pipe(
      map((res: Message) => {
        this.updateLatest(res)
        this.updateMap(res)
      })
    )
  }

  @action
  delete(id: string): Observable<any> {
    return this.http.delete<any>(url + '/' + id)
  }

  @action
  updateLatest(message: Message) {
    for (const [i, m] of this.latest.entries()) {
      if (m._id === message._id) {
        this.latest[i] = message
        break
      }
    }
  }

  @action
  updateMap(message: Message) {
    const messages = this.map.get(message.peer._id) ?? []
    for (const [i, m] of messages.entries()) {
      if (m._id === message._id) {
        messages[i] = message
        break
      }
    }
    this.map.set(message.peer._id, messages)
    setMap(key, this.map)
  }
}
