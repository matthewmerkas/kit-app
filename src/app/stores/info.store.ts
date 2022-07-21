import { HttpClient } from '@angular/common/http'
import { map, Observable } from 'rxjs'
import { action, observable } from 'mobx-angular'
import { environment } from '../../environments/environment'
import { getItem, setItem } from '../functions/local-storage'

export class InfoStore {
  @observable object: any = getItem('info_object') ?? {}
  url = environment.apiUrl + environment.apiConfig.info

  constructor(protected http: HttpClient) {}

  @action
  get(): Observable<any> {
    return this.http.get<any>(this.url).pipe(
      map((data: any[]) => {
        setItem('info_object', data)
        this.object = data
        return data
      })
    )
  }
}
