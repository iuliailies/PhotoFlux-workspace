import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ModalService } from 'src/app/shared/modal/modal.service';
import { PhotoModalComponent } from '../photo-modal/photo-modal.component';
import { AuthService } from 'src/app/auth/shared/auth.service';
import { Photo } from 'src/app/shared/models/photo.model';
import { DomSanitizer } from '@angular/platform-browser';
import { PhotoService } from 'src/app/shared/services/photo.service';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MinioService } from 'src/app/shared/services/minio.service';
import {
  TOAST_STATE,
  ToastService,
} from 'src/app/shared/components/toast/toast.service';

@UntilDestroy()
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass'],
})
export class ProfileComponent implements OnInit {
  @ViewChild('profile') profile!: ElementRef;
  @Input() isOpen: boolean = false;
  defaultWidth = 500;
  width: number = this.defaultWidth;
  appliedWidth: number = this.defaultWidth;
  photos: Photo[] = [];
  numberStars = 0;
  numberPhotos = 0;
  loading = false;
  error?: string;

  functionBindings = {
    move: this.handleMouseMove.bind(this),
    up: this.handleMouseUp.bind(this),
  };
  mouseStartXCoordinate = 0;

  constructor(
    private modalService: ModalService,
    private authService: AuthService,
    private photoService: PhotoService,
    private minioService: MinioService,
    private sanitizer: DomSanitizer,
    private toastService: ToastService
  ) {
    this.listPhotos();
  }

  get userName(): string {
    return this.authService.user?.name || '';
  }

  ngOnInit(): void {
    // extra check, in case there was not enough space for the default width value
    this.width = 500 < window.innerWidth * 0.8 ? 500 : window.innerWidth * 0.8;
    this.appliedWidth = this.width;
  }

  listPhotos(): void {
    this.loading = true;
    this.photoService
      .listMyPhotos()
      .pipe(untilDestroyed(this))
      .subscribe(
        (resp) => {
          this.photos = resp.data;
          this.numberPhotos = resp.numberPhotos;
          this.numberStars = resp.numberStars;
          this.getPhotoFiles();
        },
        (err) => {
          this.error = err;
        }
      );
  }

  getPhotoFiles(): void {
    const request = this.photos.map((photo) =>
      this.minioService.getPhoto(photo.href)
    );
    forkJoin(request)
      .pipe(
        catchError(() => of(false)),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((responses) => {
        if (responses === false) {
          this.error = 'Error while loading gallery.';
          return;
        }
        (responses as any[]).forEach((resp, index) => {
          this.photos[index].file = new File([resp], '');
          this.photos[index].url = this.sanitizeUrl(
            URL.createObjectURL(this.photos[index].file!)
          );
        });
      });
  }

  resize(event: MouseEvent): void {
    this.mouseStartXCoordinate = event.x;
    this.width = this.profile.nativeElement.getBoundingClientRect().width;
    this.profile.nativeElement.classList.add('is-dragged');
    document.documentElement.style.cursor = 'col-resize';
    document.addEventListener('mousemove', this.functionBindings.move);
    document.addEventListener('mouseup', this.functionBindings.up);
  }

  handleMouseMove(event: MouseEvent): void {
    const distance = event.x - this.mouseStartXCoordinate;
    this.appliedWidth = this.width + distance;
    document.getSelection()?.removeAllRanges();
  }

  handleMouseUp(): void {
    document.removeEventListener('mousemove', this.functionBindings.move);
    document.removeEventListener('mouseup', this.functionBindings.up);
    this.profile.nativeElement.classList.remove('is-dragged');
    document.documentElement.style.cursor = 'auto';
  }

  openUploadModal(): void {
    const modalRef = this.modalService.open(PhotoModalComponent);

    modalRef.result.then(
      (resp: Photo) => {
        resp.url = this.sanitizeUrl(URL.createObjectURL(resp.file!));
        this.photos.unshift(resp);
        this.toastService.showToast(TOAST_STATE.success, [
          { toastMessage: `<div>Photo successfully uploaded.</div>` },
        ]);
      },
      () => {}
    );
  }

  sanitizeUrl(url: string): string {
    return this.sanitizer.bypassSecurityTrustUrl(url) as string;
  }
}
