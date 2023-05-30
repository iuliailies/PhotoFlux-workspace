import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize } from 'rxjs';
import { AuthService } from 'src/app/auth/shared/auth.service';
import { CreateDashboardModalComponent } from 'src/app/dashboard/create-dashboard-modal/create-dashboard-modal.component';
import { ModalService } from 'src/app/shared/modal/modal.service';
import { Board } from 'src/app/shared/models/board.model';
import { BoardService } from 'src/app/shared/services/board.service';

@UntilDestroy()
@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.sass'],
})
export class BoardsComponent implements OnInit {
  @Output() closeMe = new EventEmitter();
  numberBoards = 0;
  boards: Board[] = [];
  loading = false;
  error?: string;

  constructor(
    private authService: AuthService,
    private boardsService: BoardService,
    private router: Router,
    private modalService: ModalService
  ) {
    this.boardsService.boardCreated$.subscribe((board) => {
      this.boards.push(board);
    });
    this.listBoards();
  }

  ngOnInit(): void {}

  get userName(): string {
    return this.authService.user?.name || '';
  }

  listBoards(): void {
    this.loading = true;
    this.boardsService
      .listBoards()
      .pipe(
        untilDestroyed(this),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (resp) => {
          this.boards = resp;
          this.numberBoards = resp.length;
        },
        (err) => {
          this.error = err;
        }
      );
  }

  openCreateModal(): void {
    const modalRef = this.modalService.open(CreateDashboardModalComponent);

    modalRef.result.then(
      (resp) => {
        this.openBoard(resp.id);
        this.closeMe.emit();
      },
      () => {}
    );
  }

  openBoard(id: string) {
    this.closeMe.emit();
    this.router.navigate([`/dashboard/${id}`]);
  }
}
