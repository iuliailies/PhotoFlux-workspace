import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appDragUpload]',
})
export class DragUploadDirective {
  private domElement: HTMLElement;
  @Output() fileDropped = new EventEmitter<FileList>();

  constructor(private element: ElementRef, private renderer: Renderer2) {
    this.domElement = this.element.nativeElement;
  }

  @HostListener('dragover', ['$event']) onDragOver(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.renderer.addClass(this.domElement, 'active');
  }

  @HostListener('dragleave', ['$event']) onDragLeave(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.renderer.removeClass(this.domElement, 'active');
  }

  @HostListener('drop', ['$event']) onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.renderer.removeClass(this.domElement, 'active');
    if (event.dataTransfer) {
      const files = event.dataTransfer.files;
      this.fileDropped.emit(files);
    }
  }
}
