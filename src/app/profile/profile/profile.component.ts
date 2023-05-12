import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ModalService } from 'src/app/shared/modal/modal.service';
import { PhotoModalComponent } from '../photo-modal/photo-modal.component';
import { AuthService } from 'src/app/auth/shared/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass'],
})
export class ProfileComponent implements OnInit {
  @ViewChild('profile') profile!: ElementRef;
  @Input() isOpen: boolean = false;
  defaultWidth = 500;
  width: number = this.defaultWidth;
  appliedWidth: number = this.defaultWidth;

  dummyImages = [
    './assets/wallpapers/chess.jpg',
    './assets/wallpapers/stairs.jpg',
    './assets/wallpapers/land.jpg',
    './assets/wallpapers/zoom.jpg',
    './assets/wallpapers/landing.jpg',
    './assets/wallpapers/sand.jpg',
    './assets/wallpapers/chess.jpg',
    './assets/wallpapers/stairs.jpg',
    './assets/wallpapers/land.jpg',
    './assets/wallpapers/zoom.jpg',
    './assets/wallpapers/landing.jpg',
    './assets/wallpapers/sand.jpg',
  ];

  functionBindings = {
    move: this.handleMouseMove.bind(this),
    up: this.handleMouseUp.bind(this),
  };
  mouseStartXCoordinate = 0;

  constructor(
    private modalService: ModalService,
    private authService: AuthService
  ) {}

  get userName(): string {
    return this.authService.user?.name || '';
  }

  ngOnInit(): void {
    // extra check, in case there was not enough space for the default width value
    this.width = 500 < window.innerWidth * 0.8 ? 500 : window.innerWidth * 0.8;
    this.appliedWidth = this.width;
  }

  resize(event: MouseEvent): void {
    this.mouseStartXCoordinate = event.x;
    this.width = this.profile.nativeElement.getBoundingClientRect().width;
    this.profile.nativeElement.classList.add('is-dragged');
    document.documentElement.style.cursor = 'col-resize';
    document.addEventListener('mousemove', this.functionBindings.move);
    document.addEventListener('mouseup', this.functionBindings.up);
  }

  handleMouseMove(event: MouseEvent): void {
    const distance = event.x - this.mouseStartXCoordinate;
    this.appliedWidth = this.width + distance;
    document.getSelection()?.removeAllRanges();
  }

  handleMouseUp(): void {
    document.removeEventListener('mousemove', this.functionBindings.move);
    document.removeEventListener('mouseup', this.functionBindings.up);
    this.profile.nativeElement.classList.remove('is-dragged');
    document.documentElement.style.cursor = 'auto';
  }

  openUploadModal(): void {
    const modalRef = this.modalService.open(PhotoModalComponent);
  }
}
