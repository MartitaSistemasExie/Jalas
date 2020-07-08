import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EstablishmentGalleryPageRoutingModule } from './establishment-gallery-routing.module';

import { EstablishmentGalleryPage } from './establishment-gallery.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EstablishmentGalleryPageRoutingModule
  ],
  declarations: [EstablishmentGalleryPage]
})
export class EstablishmentGalleryPageModule {}
