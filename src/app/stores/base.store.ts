import { HttpClient } from '@angular/common/http'
import { map, Observable, of } from 'rxjs'
import { action, observable } from 'mobx-angular'
import { environment } from '../../environments/environment'
import { getItem, setItem } from '../functions/local-storage'
import * as equal from 'fast-deep-equal/es6'

export class BaseStore {
  @observable array: any[]
  key: string
  url = environment.apiUrl

  constructor(public path: string, public http: HttpClient) {
    this.url += path
    this.key = path.replace('/', '') + '_array'
    this.array = getItem(this.key) ?? []
  }

  @action
  create(data: any): Observable<any> {
    return this.http.post<any>(this.url, data)
  }

  @action
  get(id: string, force = false): Observable<any> {
    if (!force) {
      for (const item of this.array) {
        if (item._id === id) {
          return of(item)
        }
      }
    }
    return this.http.get<any>(this.url + '/' + id).pipe(
      map((res: any) => {
        this.updateArray(res)
        return res
      })
    )
  }

  @action
  getList(filter?: any, sort?: string, limit?: number): Observable<any> {
    const queryParams = new URLSearchParams({ ...filter, sort, limit })
    return this.http.get<any>(this.url + '?' + queryParams).pipe(
      map((res: any[]) => {
        if (!filter && !equal(this.array, res)) {
          setItem(this.key, res)
          this.array = res
        }
        return res
      })
    )
  }

  @action
  set(id: string, data: any): Observable<any> {
    return this.http.put<any>(this.url + '/' + id, data).pipe(
      map((res: any) => {
        this.updateArray(res)
      })
    )
  }

  @action
  patch(id: string, data: any): Observable<any> {
    return this.http.put<any>(this.url + '/' + id + '/patch', data).pipe(
      map((res: any) => {
        this.updateArray(res)
      })
    )
  }

  @action
  delete(id: string): Observable<any> {
    return this.http.delete<any>(this.url + '/' + id)
  }

  updateArray(data: any) {
    for (const [i, item] of this.array.entries()) {
      if (item._id === data._id) {
        this.array[i] = data
      }
    }
    setItem(this.key, this.array)
  }
}
