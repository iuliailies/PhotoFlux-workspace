import { Component, OnInit } from '@angular/core';
import { TOAST_STATE, ToastData, ToastService } from './toast.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
} from '@angular/animations';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.sass'],
  animations: [
    trigger('myInsertRemoveTrigger', [
      state('danger-toast', style({ opacity: '1' })),
      state('warning-toast', style({ opacity: '1' })),
      state('success-toast', style({ opacity: '1' })),
      transition('void => success-toast', [
        style({ opacity: 0 }),
        animate('100ms', style({ opacity: 1 })),
      ]),
      transition('void => warning-toast', [
        style({ opacity: 0 }),
        animate('100ms', style({ opacity: 1 })),
      ]),
      transition('void => danger-toast', [
        style({ opacity: 0 }),
        animate(
          300,
          keyframes([
            style({ transform: 'translateX(0px)', offset: 0 }),
            style({ opacity: '1', offset: 0 }),
            style({ transform: 'translateX(3px)', offset: 0.2 }),
            style({ transform: 'translateX(-3px)', offset: 0.4 }),
            style({ transform: 'translateX(5px)', offset: 0.6 }),
            style({ transform: 'translateX(-5px)', offset: 0.8 }),
            style({ transform: 'translateX(0px)', offset: 1 }),
          ])
        ),
      ]),
      transition(':leave', [animate('100ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class ToastComponent implements OnInit {
  toastObjects: ToastData[] = [];

  TOAST_STATE = TOAST_STATE;

  // all toast timers get paused when hovering over one
  paused = false;

  constructor(public toast: ToastService) {
    this.toast.showsToast$.subscribe((value) => {
      this.toastObjects.unshift(value);
    });
  }

  ngOnInit(): void {}

  dismissByIndex(index: number): void {
    this.toastObjects.splice(index, 1)[0];
    // manually changing the pause boolean because removing an element from the dom doesn't trigger a mouseout event
    this.paused = false;
  }

  dismissByObject(object: ToastData): void {
    const index = this.toastObjects.indexOf(object);
    this.dismissByIndex(index);
  }
}
