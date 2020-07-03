import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditConfigPage } from './edit-config.page';

const routes: Routes = [
  {
    path: '',
    component: EditConfigPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditConfigPageRoutingModule {}
