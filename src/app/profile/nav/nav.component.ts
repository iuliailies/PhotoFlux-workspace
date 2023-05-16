import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/auth/shared/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.sass'],
})
export class NavComponent implements OnInit {
  @Output() profileClickedEvent = new EventEmitter();
  @Output() boardsClickedEvent = new EventEmitter();
  profileOpen = false;
  boardsOpen = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  get userInitials(): string {
    return this.authService.user
      ? this.authService.user.name.slice(0, 2).toUpperCase()
      : '';
  }

  clickProfile(): void {
    this.profileClickedEvent.emit();
    if (this.boardsOpen) {
      this.clickBoards();
    }
    this.boardsOpen = false;
    this.profileOpen = !this.profileOpen;
  }

  clickBoards(): void {
    this.boardsClickedEvent.emit();
    if (this.profileOpen) {
      this.clickProfile();
    }
    this.boardsOpen = !this.boardsOpen;
  }

  logout(): void {
    if (this.profileOpen) {
      this.clickProfile();
    }
    this.authService.logout().subscribe();
  }
}
