import { InjectionToken } from '@angular/core';

export interface ComboboxOptions {
  placeholder?: string;
  title?: string;
  search?: boolean;
  searchPlaceholder?: string;
  searchAutofocus?: boolean;
  limitSelection?: number;
}

export const defaultComboboxOptions: ComboboxOptions = {
  placeholder: 'Choose...',
  title: '',
  search: true,
  searchPlaceholder: 'Search...',
  searchAutofocus: true,
  limitSelection: 0,
};
