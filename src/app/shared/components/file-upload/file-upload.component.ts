import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.sass'],
})
export class FileUploadComponent implements OnInit {
  @ViewChild('targetImage') targetImage!: ElementRef;
  error?: string;
  file?: File;
  @Output() fileChanged = new EventEmitter<File | undefined>();

  constructor() {}

  ngOnInit(): void {}

  imageHandler(event: Event): void {
    const files = (event.currentTarget as HTMLInputElement).files;
    if (files) {
      this.onFileDropped(files);
    }
  }

  onFileDropped(files: FileList): void {
    if (files.length) {
      this.file = files[0];
      this.targetImage.nativeElement.src = URL.createObjectURL(this.file);
      this.fileChanged.emit(this.file);
    }
  }

  removeFile(): void {
    this.file = undefined;
    this.fileChanged.emit(this.file);
  }
}
