import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { NavComponent } from './nav/nav.component';

@NgModule({
  declarations: [ProfileComponent, NavComponent],
  imports: [CommonModule],
  exports: [ProfileComponent, NavComponent],
})
export class ProfileModule {}
