import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'signin',
    loadChildren: () => import('./pages/signin/signin.module').then( m => m.SigninPageModule)
  },
  {
    path: 'signin-info',
    loadChildren: () => import('./pages/signin-info/signin-info.module').then( m => m.SigninInfoPageModule)
  },
  {
    path: 'password-reset',
    loadChildren: () => import('./pages/modals/password-reset/password-reset.module').then( m => m.PasswordResetPageModule)
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./pages/modals/edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
  },
  {
    path: 'edit-config',
    loadChildren: () => import('./pages/modals/edit-config/edit-config.module').then( m => m.EditConfigPageModule)
  },
  {
    path: 'edit-password',
    loadChildren: () => import('./pages/modals/edit-password/edit-password.module').then( m => m.EditPasswordPageModule)
  },
  {
    path: 'event-detail',
    loadChildren: () => import('./pages/modals/event-detail/event-detail.module').then( m => m.EventDetailPageModule)
  },
  {
    path: 'establishment-detail',
    // tslint:disable-next-line: max-line-length
    loadChildren: () => import('./pages/modals/establishment-detail/establishment-detail.module').then( m => m.EstablishmentDetailPageModule)
  },
  {
    path: 'main-tabs',
    loadChildren: () => import('./pages/tabs/main-tabs/main-tabs.module').then( m => m.MainTabsPageModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./pages/welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: 'establishment-gallery',
    loadChildren: () => import('./pages/modals/establishment-gallery/establishment-gallery.module').then( m => m.EstablishmentGalleryPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
