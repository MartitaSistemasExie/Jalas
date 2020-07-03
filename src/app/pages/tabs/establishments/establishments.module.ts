import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EstablishmentsPageRoutingModule } from './establishments-routing.module';

import { EstablishmentsPage } from './establishments.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EstablishmentsPageRoutingModule
  ],
  declarations: [EstablishmentsPage]
})
export class EstablishmentsPageModule {}
