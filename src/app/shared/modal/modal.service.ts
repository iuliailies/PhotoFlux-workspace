import {
  Injectable,
  Injector,
  ComponentFactoryResolver,
  Renderer2,
  RendererFactory2,
} from '@angular/core';
import { ModalOptions, ModalConfig } from './modal-config.service';
import { ModalRef } from './modal-ref.class';
import { ModalStack } from './modal-stack.class';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private renderer: Renderer2;
  constructor(
    private moduleComponentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private modalStack: ModalStack,
    private config: ModalConfig,
    private rendererFactory: RendererFactory2
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.modalStack.closed.subscribe(() => {
      this.enableBackgroundElements();
    });
  }

  open<T>(content: T, options: ModalOptions = {}): ModalRef<T> {
    const combinedOptions = Object.assign({}, this.config, options);
    this.disableBackgroundElements();
    return this.modalStack.open(
      this.moduleComponentFactoryResolver,
      this.injector,
      content,
      combinedOptions
    );
  }

  dismissAll(reason?: any): void {
    this.modalStack.dismissAll(reason);
    this.enableBackgroundElements();
  }

  hasOpenModals(): boolean {
    return this.modalStack.hasOpenModals();
  }

  disableBackgroundElements(): void {
    // avoid navigating through interactive background elements with the tab key
    const layers = [];
    layers.push(document.querySelector('.main') as Element);
    const backgroundModals = Array.from(document.querySelectorAll('app-modal'));
    layers.push(...backgroundModals);
    layers.forEach((modal, index) => {
      if (index === backgroundModals.length - 1) {
        return;
      }
      const interactiveElements = modal.querySelectorAll(
        'button,a,details,input,select,textarea'
      );
      interactiveElements?.forEach((elem) => {
        this.renderer.setAttribute(elem, 'tabindex', '-1');
      });
    });
  }

  enableBackgroundElements(): void {
    const backgroundModals = Array.from(document.querySelectorAll('app-modal'));
    let focusable: HTMLElement;
    if (!backgroundModals.length) {
      focusable = document.querySelector('.main') as HTMLElement;
    } else {
      focusable = backgroundModals.pop() as HTMLElement;
    }
    const interactiveElements = focusable.querySelectorAll(
      'button,a,details,input,select,textarea'
    );
    interactiveElements?.forEach((elem) => {
      this.renderer.removeAttribute(elem, 'tabindex');
    });
  }
}
