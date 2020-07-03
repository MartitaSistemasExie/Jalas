import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditConfigPageRoutingModule } from './edit-config-routing.module';

import { EditConfigPage } from './edit-config.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditConfigPageRoutingModule
  ],
  declarations: [EditConfigPage]
})
export class EditConfigPageModule {}
