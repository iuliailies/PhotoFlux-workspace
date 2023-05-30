import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-infinite-scroll',
  templateUrl: `./infinite-scroll.component.html`,
  styleUrls: ['./infinite-scroll.component.sass'],
})
export class InfiniteScrollComponent implements AfterViewInit {
  @Input() options = {};
  @Output() scrolled = new EventEmitter();
  @ViewChild('anchor') anchor!: ElementRef<HTMLElement>;

  constructor(private host: ElementRef) {}

  ngAfterViewInit(): void {
    const options = {
      root: null,
      ...this.options,
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.scrolled.emit();
      }
    }, options);

    observer.observe(this.anchor.nativeElement);
  }
}
