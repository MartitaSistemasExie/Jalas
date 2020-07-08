import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstablishmentGalleryPage } from './establishment-gallery.page';

const routes: Routes = [
  {
    path: '',
    component: EstablishmentGalleryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstablishmentGalleryPageRoutingModule {}
