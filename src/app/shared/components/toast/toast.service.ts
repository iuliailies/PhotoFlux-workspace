import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export const TOAST_STATE = {
  success: 'success-toast',
  warning: 'warning-toast',
  danger: 'danger-toast',
  inactive: 'inactive-toast',
};

export type ToastButton = {
  icon?: string;
  text: string;
  funcionality: () => void;
};

export type ToastLineContent = {
  toastMessage: string;
  button?: ToastButton;
};

export type ToastData = {
  toastState: string;
  toastContent: ToastLineContent[];
  dismissTimeout: number;
};

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  // triggers the appearance of a new toast in the DOM
  public showsToast$: Subject<ToastData> = new Subject<ToastData>();
  // triggers the removal of a toast from the DOM
  public dismissToast$: Subject<ToastData> = new Subject<ToastData>();

  public defaultDismissTimeout = 7000;

  constructor() {}

  showToast(toastState: string, toastContent: ToastLineContent[]): void {
    const data: ToastData = {
      toastState: toastState,
      toastContent: toastContent,
      dismissTimeout: this.calculateDismissTimeout(toastContent),
    };
    this.showsToast$.next(data);
  }

  calculateDismissTimeout(content: ToastLineContent[]) {
    let contentLength = 0;
    content.forEach((line) => {
      contentLength += line.toastMessage.length;
      if (line.button) {
        contentLength += 200;
      }
    });
    const timeout = contentLength * 80;
    return timeout > this.defaultDismissTimeout
      ? timeout
      : this.defaultDismissTimeout;
  }
}
