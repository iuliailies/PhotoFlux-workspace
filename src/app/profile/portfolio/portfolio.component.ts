import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { AuthService } from 'src/app/auth/shared/auth.service';
import {
  TOAST_STATE,
  ToastService,
} from 'src/app/shared/components/toast/toast.service';
import { ModalService } from 'src/app/shared/modal/modal.service';
import { Photo } from 'src/app/shared/models/photo.model';
import { MinioService } from 'src/app/shared/services/minio.service';
import { PhotoService } from 'src/app/shared/services/photo.service';
import { PhotoModalComponent } from '../photo-modal/photo-modal.component';

@UntilDestroy()
@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.sass'],
})
export class PortfolioComponent implements OnInit {
  photos: Photo[] = [];
  numberStars = 0;
  numberPhotos = 0;
  loading = false;
  error?: string;
  next?: string;

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

  ngOnInit(): void {}

  get userName(): string {
    return this.authService.user?.name || '';
  }

  listPhotos(): void {
    if (this.next == '') {
      return;
    }
    this.loading = true;
    this.photoService
      .listMyPhotos(this.next)
      .pipe(untilDestroyed(this))
      .subscribe(
        (resp) => {
          this.numberPhotos = resp.numberPhotos;
          this.numberStars = resp.numberStars;
          this.next = resp.next;
          this.getPhotoFiles(resp.data);
        },
        (err) => {
          this.error = err;
        }
      );
  }

  getPhotoFiles(photos: Photo[]): void {
    const length = photos.length;
    // TODO: improve, move minio interaction into the service
    const request = photos.map((photo) =>
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
        this.photos.push(...photos);
        (responses as any[]).forEach((resp, index) => {
          this.photos[this.photos.length - length + index].file = new File(
            [resp],
            ''
          );
          this.photos[this.photos.length - length + index].url =
            this.sanitizeUrl(
              URL.createObjectURL(
                this.photos[this.photos.length - length + index].file!
              )
            );
        });
      });
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
