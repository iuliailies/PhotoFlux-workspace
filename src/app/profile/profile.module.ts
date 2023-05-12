import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { NavComponent } from './nav/nav.component';
import { PhotoModalComponent } from './photo-modal/photo-modal.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ProfileComponent, NavComponent, PhotoModalComponent],
  imports: [CommonModule, SharedModule],
  exports: [ProfileComponent, NavComponent],
})
export class ProfileModule {}
