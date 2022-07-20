import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { JwtModule } from '@auth0/angular-jwt'
import { RouteReuseStrategy } from '@angular/router'

import { IonicModule, IonicRouteStrategy } from '@ionic/angular'

import { AppComponent } from './app.component'
import { AppRoutingModule } from './app-routing.module'
import { ErrorInterceptor } from './interceptors/error-interceptor'
import { LoadingInterceptor } from './interceptors/loading-interceptor'
import { getToken } from './functions/local-storage'
import { getHost } from './functions/api'

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    IonicModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: getToken,
        allowedDomains: [getHost()],
      },
    }),
    AppRoutingModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
