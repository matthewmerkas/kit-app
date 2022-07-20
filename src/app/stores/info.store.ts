import { HttpClient } from '@angular/common/http'
import { map, Observable } from 'rxjs'
import { action, observable } from 'mobx-angular'
import { environment } from '../../environments/environment'

export class InfoStore {
  @observable object: any = {}
  url = environment.apiUrl

  constructor(protected http: HttpClient) {}

  @action
  get(): Observable<any> {
    return this.http.get<any>(this.url + '/info').pipe(
      map((data: any[]) => {
        this.object = data
        return data
      })
    )
  }
}
