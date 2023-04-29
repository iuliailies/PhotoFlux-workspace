import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthWrapperComponent } from './auth/auth-wrapper/auth-wrapper.component';
import { AlreadyAuthGuardService } from './auth/shared/already-auth-guard.service';
import { AuthGuardService } from './auth/shared/auth-guard.service';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'welcome',
    component: AuthWrapperComponent,
    canActivate: [AlreadyAuthGuardService],
  },
  {
    path: 'login',
    pathMatch: 'full',
    redirectTo: 'welcome',
  },
  {
    path: 'register',
    pathMatch: 'full',
    redirectTo: 'welcome',
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
    canLoad: [AuthGuardService],
  },
  // { path: '**', redirectTo: 'welcome' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
