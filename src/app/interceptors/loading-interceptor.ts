import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { finalize } from 'rxjs/operators'
import { Store } from '../stores/store'

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private store: Store) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.endsWith('/api/info')) {
      return next.handle(req)
    } else {
      this.store.ui.setLoading(true)
      return next.handle(req).pipe(
        finalize(() => {
          this.store.ui.setLoading(false)
        })
      )
    }
  }
}
