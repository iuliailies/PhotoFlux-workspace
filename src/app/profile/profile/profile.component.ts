import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass'],
})
export class ProfileComponent implements OnInit {
  @ViewChild('profile') profile!: ElementRef;
  @Input() isOpen: boolean = false;
  width = 500;
  appliedWidth = 500;

  functionBindings = {
    move: this.handleMouseMove.bind(this),
    up: this.handleMouseUp.bind(this),
  };
  mouseStartXCoordinate = 0;

  constructor() {}

  ngOnInit(): void {}

  resize(event: MouseEvent): void {
    this.mouseStartXCoordinate = event.x;
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
    this.width = this.appliedWidth;
  }
}
