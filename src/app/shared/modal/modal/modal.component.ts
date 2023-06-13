import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { ModalService } from '../modal.service';

export enum ModalDismissReasons {
  BACKDROP_CLICK,
  ESC,
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.sass'],
})
export class ModalComponent implements OnInit, AfterViewInit {
  @Input() backdrop: boolean | 'white' = true;
  @Input() backdropOpacity = 0.5;
  @Input() keyboard = true;
  @Input() size: 'small' | 'large' | 'medium' | 'fullscreen' = 'medium';

  @Output() dismissEvent = new EventEmitter();

  constructor(
    private modalService: ModalService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    // blur selected background button
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    // if there is at least an input, focus it
    const input = this.elementRef.nativeElement.querySelector('input');
    if (input) {
      input.focus();
      return;
    }

    // if there is no input, there should be at least one button enabled => we can focus it
    // prioritize focusing the submit one
    const submitButton = this.elementRef.nativeElement.querySelector(
      'button[type="submit"]'
    );
    let buttons = submitButton ? [submitButton] : [];
    buttons = buttons.concat(
      ...Array.from(this.elementRef.nativeElement.querySelectorAll('button'))
    );
    for (let button of buttons) {
      if (!button.disabled) {
        button.focus();
        return;
      }
    }
  }

  ngAfterViewInit(): void {
    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(
        takeUntil(this.dismissEvent),
        filter((e: KeyboardEvent) => e.key === 'Escape' && this.keyboard)
      )
      .subscribe((e: KeyboardEvent) =>
        requestAnimationFrame(() => {
          if (!e.defaultPrevented) {
            this.modalService.dismissAll();
          }
        })
      );
  }
}
