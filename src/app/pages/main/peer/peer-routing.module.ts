import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { PeerPage } from './peer.page'

const routes: Routes = [
  {
    path: '',
    component: PeerPage,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PeerPageRoutingModule {}
