import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from './modal/modal.module';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { DragUploadDirective } from './directives/drag-upload.directive';
import { HttpClientModule } from '@angular/common/http';
import { ComboboxComponent } from './components/combobox/combobox.component';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from './components/loader/loader.component';

@NgModule({
  declarations: [
    FileUploadComponent,
    DragUploadDirective,
    ComboboxComponent,
    LoaderComponent,
  ],
  imports: [CommonModule, ModalModule, HttpClientModule, FormsModule],
  exports: [
    FileUploadComponent,
    ComboboxComponent,
    LoaderComponent,
    FormsModule,
  ],
})
export class SharedModule {}
