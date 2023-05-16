import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/shared/modal/modal.service';
import { CreateDashboardModalComponent } from '../create-dashboard-modal/create-dashboard-modal.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass'],
})
export class DashboardComponent implements OnInit {
  board = false;

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {}

  openCreateModal(): void {
    const modalRef = this.modalService.open(CreateDashboardModalComponent);

    modalRef.result.then(
      () => {},
      () => {}
    );
  }
}
