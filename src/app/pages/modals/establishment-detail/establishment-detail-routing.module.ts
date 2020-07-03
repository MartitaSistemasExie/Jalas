import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstablishmentDetailPage } from './establishment-detail.page';

const routes: Routes = [
  {
    path: '',
    component: EstablishmentDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstablishmentDetailPageRoutingModule {}
