import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthWrapperComponent } from './auth/auth-wrapper/auth-wrapper.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'welcome' },
  { path: 'welcome', component: AuthWrapperComponent },
  { path: 'login', pathMatch: 'full', redirectTo: 'welcome' },
  { path: 'register', pathMatch: 'full', redirectTo: 'welcome' },
  { path: '**', redirectTo: 'welcome' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
