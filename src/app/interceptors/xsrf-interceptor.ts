import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { getCookie } from '../functions/cookies'
import { environment } from '../../environments/environment'

// https://stackoverflow.com/a/47591912
@Injectable()
export class HttpXsrfInterceptor implements HttpInterceptor {
  cookieName = 'XSRF-TOKEN'
  headerName = 'X-XSRF-TOKEN'

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Only add XSRF token for stores to API in production environment
    if (req.url.includes(environment.apiUrl) && environment.production) {
      const token = getCookie(this.cookieName)
      if (token !== null && !req.headers.has(this.headerName)) {
        req = req.clone({ headers: req.headers.set(this.headerName, token) })
      }
    }
    return next.handle(req)
  }
}
