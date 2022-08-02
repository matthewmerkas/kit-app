import { HttpClient } from '@angular/common/http'
import { map, Observable, of } from 'rxjs'
import { action, observable } from 'mobx-angular'
import { environment } from '../../environments/environment'
import { getItem, setItem } from '../functions/local-storage'

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
  get(id: string): Observable<any> {
    for (const item of this.array) {
      if (item._id === id) {
        return of(item)
      }
    }
    return this.http.get<any>(this.url + '/' + id)
  }

  @action
  getList(filter?: any, sort?: string): Observable<any> {
    const queryParams = new URLSearchParams({ ...filter, sort })
    return this.http.get<any>(this.url + '?' + queryParams).pipe(
      map((data: any[]) => {
        if (!filter) {
          setItem(this.key, data)
          this.array = data
        }
        return data
      })
    )
  }

  @action
  update(id: string, data: any): Observable<any> {
    return this.http.put<any>(this.url + '/' + id, data)
  }

  @action
  delete(id: string): Observable<any> {
    return this.http.delete<any>(this.url + '/' + id)
  }
}
