import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/shared/auth.service';
import { Board } from 'src/app/shared/models/board.model';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.sass'],
})
export class BoardsComponent implements OnInit {
  numberBoards = 0;
  boards: Board[] = [];
  loading = false;
  error?: string;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  get userName(): string {
    return this.authService.user?.name || '';
  }
}
