import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainTabsPage } from './main-tabs.page';

const routes: Routes = [
  {
    path: 'main-tabs',
    component: MainTabsPage,
    children: [
      {
        path: 'establishments',
        loadChildren: () => import('../establishments/establishments.module').then(m => m.EstablishmentsPageModule)
      },
      {
        path: 'events',
        loadChildren: () => import('../events/events.module').then(m => m.EventsPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('../settings/settings.module').then(m => m.SettingsPageModule)
      },
      {
        path: '',
        redirectTo: 'main-tabs/profile',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'main-tabs/profile',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainTabsPageRoutingModule {}
