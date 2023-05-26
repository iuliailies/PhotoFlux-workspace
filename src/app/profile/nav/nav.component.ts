import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/auth/shared/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.sass'],
})
export class NavComponent implements OnInit {
  @Output() profileClickedEvent = new EventEmitter();
  @Output() boardsClickedEvent = new EventEmitter();
  @Input() portfolioOpen = false;
  @Input() boardsOpen = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  get userInitials(): string {
    return this.authService.user
      ? this.authService.user.name.slice(0, 2).toUpperCase()
      : '';
  }

  clickPortfolio(): void {
    this.profileClickedEvent.emit();
    if (this.boardsOpen) {
      this.clickBoards();
    }
    this.boardsOpen = false;
    this.portfolioOpen = !this.portfolioOpen;
  }

  clickBoards(): void {
    this.boardsClickedEvent.emit();
    if (this.portfolioOpen) {
      this.clickPortfolio();
    }
    this.boardsOpen = !this.boardsOpen;
  }

  logout(): void {
    if (this.portfolioOpen) {
      this.clickPortfolio();
    }
    if (this.boardsOpen) {
      this.clickBoards();
    }
    this.authService.logout().subscribe();
  }
}
