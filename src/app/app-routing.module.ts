import { NgModule } from '@angular/core'
import { PreloadAllModules, RouterModule, Routes } from '@angular/router'
import { JwtGuard } from './guards/jwt-guard'

const routes: Routes = [
  {
    path: 'auth/login',
    loadChildren: () =>
      import('./pages/auth/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'auth/tour',
    loadChildren: () =>
      import('./pages/auth/tour/tour.module').then((m) => m.TourPageModule),
  },
  {
    canActivate: [JwtGuard],
    path: 'home',
    loadChildren: () =>
      import('./pages/main/home/home.module').then((m) => m.HomePageModule),
  },
  {
    canActivate: [JwtGuard],
    path: 'home/peer/:id',
    loadChildren: () =>
      import('./pages/main/peer/peer.module').then((m) => m.PeerPageModule),
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',
  },
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
