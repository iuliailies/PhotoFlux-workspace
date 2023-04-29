import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.sass'],
})
export class NavComponent implements OnInit {
  @Output() profileClickedEvent = new EventEmitter();
  profileOpen = false;
  constructor() {}

  ngOnInit(): void {}

  clickProfile(): void {
    this.profileClickedEvent.emit();
    this.profileOpen = !this.profileOpen;
  }
}
