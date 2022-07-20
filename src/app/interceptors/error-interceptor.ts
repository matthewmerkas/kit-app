import { Injectable } from '@angular/core'
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http'
import { catchError } from 'rxjs/operators'
import { Observable, throwError } from 'rxjs'
import { Router } from '@angular/router'
import { getToken, removeTokens } from '../functions/local-storage'
import { Store } from '../stores/store'
import { JwtErrorResponse } from '../functions/types'

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private store: Store) {}

  // Source: https://stackoverflow.com/a/53379715
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: JwtErrorResponse) => {
        if (err.error instanceof Error) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('Error:', err.error.message)
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.error(
            `Status: ${err.status}\nError: ${JSON.stringify(err.error)}`
          )
          if (err.status === 0) {
            this.store.ui.openToast('Please check your connection')
          } else if (err.code === 'invalid_token') {
            this.store.user.refresh(getToken()).subscribe((res) => {
              console.log(res)
              // TODO: Retry request
              console.log('RETRY REQUEST')
            })
          } else if (err.status === 401) {
            this.openToast(err)
            removeTokens()
            this.router.navigate(['/auth/login'])
          } else {
            this.openToast(err)
          }
        }

        // If you want to return a new response:
        //return of(new HttpResponse({body: [{name: "Default value..."}]}));

        // If you want to return the error on the upper level:
        return throwError(err)

        // or just return nothing:
        // return EMPTY;
      })
    )
  }

  openToast = (err: HttpErrorResponse) => {
    if (err.error.message) {
      return this.store.ui.openToast(err.error.message)
    } else {
      return this.store.ui.openToast(err.message)
    }
  }
}