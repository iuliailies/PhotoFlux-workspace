import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  forwardRef,
} from '@angular/core';
import {
  ComboboxOptions,
  defaultComboboxOptions,
} from './combobox-options.interface';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface ComboboxValue {
  value: number | string | boolean;
  placeholder: string;
  icon?: string;
  image?: string;
}

@Component({
  selector: 'app-combobox',
  templateUrl: './combobox.component.html',
  styleUrls: ['./combobox.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ComboboxComponent),
      multi: true,
    },
  ],
})
export class ComboboxComponent implements ControlValueAccessor, OnInit {
  @Input() options: ComboboxOptions = { ...defaultComboboxOptions };
  @Input() values: ComboboxValue[] = [];
  @Input() selectedValues: ComboboxValue[] = []; // values that were already selected at initialization

  innerValue: string[] | number[] | boolean[] | never[] = [];
  isOpened = true;
  isRadioList = false;
  keyword = '';

  constructor(private elementRef: ElementRef) {}

  private onTouchedCallback: () => void = () => {};
  private onChangeCallback: (_: any) => void = () => {};

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  ngOnInit(): void {
    if (this.options.limitSelection === 1) {
      this.isRadioList = true;
    }
  }

  get items(): ComboboxValue[] {
    return !this.keyword.length
      ? this.values
      : this.values.filter((v) =>
          v.placeholder.toLowerCase().includes(this.keyword.toLowerCase())
        );
  }

  get selectedItems(): ComboboxValue[] {
    return this.values.filter(
      (v) =>
        this.innerValue &&
        this.innerValue.length &&
        this.innerValue.includes(v.value as never)
    );
  }

  get value(): string[] | number[] | boolean[] {
    return this.innerValue;
  }

  set value(val: string[] | number[] | boolean[]) {
    if (!this.values || !this.values.length) {
      throw Error('no values initialized');
    }

    this.innerValue = val;
    this.onChangeCallback(this.innerValue);
  }

  toggleItem(val: string | number | boolean): void {
    if (this.options.limitSelection === 1) {
      this.innerValue = [val as never];
      this.value = this.innerValue || [];
      return;
    }
    if (this.innerValue.includes(val as never)) {
      this.removeItem(val);
      return;
    }

    if (
      this.options.limitSelection !== undefined &&
      this.options.limitSelection > 0 &&
      this.innerValue.length >= this.options.limitSelection
    ) {
      return;
    }

    this.innerValue.push(val as never);
    this.value = this.innerValue || [];
    this.onTouchedCallback();
  }

  removeItem(val: string | number | boolean): void {
    const index = this.innerValue.findIndex((v: any) => v === val);
    if (index > -1) {
      this.innerValue.splice(index, 1);
    }

    this.value = this.innerValue;
  }

  removeItemEvent(e: MouseEvent, val: string | number | boolean): void {
    e.stopPropagation();
    this.removeItem(val);
  }

  isSelected(val: string | number | boolean): boolean {
    return this.innerValue.includes(val as never);
  }

  close(): void {
    this.keyword = '';
  }

  writeValue(): void {
    this.innerValue = this.selectedValues.map((elem) => elem.value as never);
  }

  @HostListener('document:click', ['$event']) onBlur(e: MouseEvent): void {
    if (!this.isOpened) {
      return;
    }

    const input =
      this.elementRef.nativeElement.querySelector('.combobox-value');
    if (!input || e.target === input || input.contains(e.target)) {
      return;
    }

    const search = this.elementRef.nativeElement.querySelector(
      '.combobox-options-search-container'
    );
    if (search && (e.target === search || search.contains(e.target))) {
      return;
    }

    const container = this.elementRef.nativeElement.querySelector(
      '.combobox-container'
    );
    if (container && container !== e.target && !container.contains(e.target)) {
      this.close();
    }
  }
}
