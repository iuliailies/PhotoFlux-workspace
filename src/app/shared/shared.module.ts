import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from './modal/modal.module';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { DragUploadDirective } from './directives/drag-upload.directive';
import { HttpClientModule } from '@angular/common/http';
import { ComboboxComponent } from './components/combobox/combobox.component';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from './components/loader/loader.component';
import { ApiInterceptorProvider } from './interceptors/api.interceptor';
import { ErrorInterceptorProvider } from './interceptors/error.interceptor';
import { RefreshTokenInterceptorProvider } from './interceptors/refresh-token.interceptor';
import { ToastComponent } from './components/toast/toast.component';
import { InfiniteScrollComponent } from './components/infinite-scroll/infinite-scroll.component';
import { InspectPhotoModalComponent } from './components/inspect-photo-modal/inspect-photo-modal.component';

@NgModule({
  declarations: [
    FileUploadComponent,
    DragUploadDirective,
    ComboboxComponent,
    LoaderComponent,
    ToastComponent,
    InfiniteScrollComponent,
    InspectPhotoModalComponent,
  ],
  imports: [CommonModule, ModalModule, HttpClientModule, FormsModule],
  exports: [
    FileUploadComponent,
    ComboboxComponent,
    LoaderComponent,
    FormsModule,
    ToastComponent,
    InfiniteScrollComponent,
  ],
  providers: [
    ApiInterceptorProvider,
    ErrorInterceptorProvider,
    RefreshTokenInterceptorProvider,
  ],
})
export class SharedModule {}
