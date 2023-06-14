import { InjectionToken } from '@angular/core';

export interface SelectboxOptions {
  placeholder?: string | string[];
}

export const SELECTBOX_OPTIONS = new InjectionToken<SelectboxOptions>(
  'Selectbox config'
);

export function mergeSelectboxOptions(
  opts: SelectboxOptions
): SelectboxOptions {
  return { ...defaultSelectboxOptions, ...opts };
}

export const defaultSelectboxOptions: SelectboxOptions = {
  placeholder: 'Choose...',
};
