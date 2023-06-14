import {
  Component,
  OnInit,
  Input,
  ElementRef,
  HostListener,
  forwardRef,
  OnChanges,
  SimpleChanges,
  EventEmitter,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import {
  defaultSelectboxOptions,
  mergeSelectboxOptions,
  SelectboxOptions,
} from './selectbox-options.interface';

export interface SelectboxValue {
  value: number | string | boolean;
  placeholder: string;
  icon?: string;
  image?: string;
}

@Component({
  selector: 'app-selectbox',
  templateUrl: './selectbox.component.html',
  styleUrls: ['./selectbox.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectboxComponent),
      multi: true,
    },
  ],
})
export class SelectboxComponent
  implements ControlValueAccessor, OnInit, OnChanges
{
  @Input() options: SelectboxOptions = { ...defaultSelectboxOptions };
  @Input() values: SelectboxValue[] = [];
  @Input() tooltipText?: string;
  @Input() customPlaceholder?: string;

  innerValue!: number | string | boolean;
  innerIndex!: number;
  placeholderText!: string | string[];
  isOpened!: boolean;
  keyword = '';

  private onTouchedCallback: () => void = () => {};
  private onChangeCallback: (_: any) => void = () => {};

  get items(): SelectboxValue[] {
    return !this.keyword.length
      ? this.values
      : this.values.filter((v) =>
          v.placeholder.toLowerCase().includes(this.keyword.toLowerCase())
        );
  }

  get value(): number | string | boolean {
    return this.innerValue;
  }

  set value(val: number | string | boolean) {
    if (!this.values || !this.values.length) {
      throw Error('no values initialized');
    }

    const index = this.values.findIndex((v) => v.value === val);
    if (index === -1) {
      return;
    }

    this.innerValue = val;
    this.innerIndex = index;
    this.placeholderText = this.values[index].placeholder;
    this.onChangeCallback(this.innerValue);
  }

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.isOpened = false;
    this.placeholderText = this.options.placeholder || '' || [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('options' in changes) {
      this.options = mergeSelectboxOptions(this.options);
    }

    if ('values' in changes && this.innerValue) {
      this.writeValue(this.innerValue);
    }
  }

  setValue(value: string | number | boolean): void {
    this.value = value;
    this.close();
  }

  toggle(): void {
    this.isOpened = !this.isOpened;
    this.onTouchedCallback();

    if (this.isOpened) {
      this.elementRef.nativeElement
        .querySelector('.selectbox-container')
        .classList.add('is-active');
    } else {
      this.elementRef.nativeElement
        .querySelector('.selectbox-container')
        .classList.remove('is-active');
    }
  }

  close(): void {
    this.isOpened = false;
    this.elementRef.nativeElement
      .querySelector('.selectbox-container')
      .classList.remove('is-active');
    this.keyword = '';
  }

  writeValue(val: number | string | boolean): void {
    if (!val && typeof val !== 'boolean') {
      return;
    }

    const index = this.values.findIndex((v) => v.value === val);
    if (index === -1) {
      this.innerValue = val;
      this.innerIndex = index;
      return;
    }

    this.placeholderText = this.values[index].placeholder;
    this.innerValue = val;
    this.innerIndex = index;
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  @HostListener('document:click', ['$event']) onBlur(e: MouseEvent): void {
    if (!this.isOpened) {
      return;
    }

    const input =
      this.elementRef.nativeElement.querySelector('.selectbox-value');
    if (!input || e.target === input || input.contains(e.target)) {
      return;
    }

    const search = this.elementRef.nativeElement.querySelector(
      '.selectbox-options-search-container'
    );
    if (search && (e.target === search || search.contains(e.target))) {
      return;
    }

    const container = this.elementRef.nativeElement.querySelector(
      '.selectbox-container'
    );
    if (container && container !== e.target && !container.contains(e.target)) {
      this.close();
    }
  }
}
