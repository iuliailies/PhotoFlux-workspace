import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { CreateDashboardModalComponent } from './create-dashboard-modal/create-dashboard-modal.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [DashboardComponent, CreateDashboardModalComponent],
  imports: [CommonModule, DashboardRoutingModule, SharedModule],
  exports: [DashboardComponent],
})
export class DashboardModule {}
