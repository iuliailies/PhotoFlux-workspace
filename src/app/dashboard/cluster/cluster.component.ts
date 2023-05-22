import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { Cluster } from 'src/app/shared/models/board.model';
import { Photo } from 'src/app/shared/models/photo.model';
import { MinioService } from 'src/app/shared/services/minio.service';
import { PhotoService } from 'src/app/shared/services/photo.service';

@Component({
  selector: 'app-cluster',
  templateUrl: './cluster.component.html',
  styleUrls: ['./cluster.component.sass'],
})
export class ClusterComponent implements OnInit {
  @Input() cluster!: Cluster;
  photos: Photo[] = [];
  displayedPhotos: Photo[] = [];
  categoryName!: string;
  loading = true;
  error = false;

  constructor(
    private photoService: PhotoService,
    private minioService: MinioService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.getPhotos();
  }

  getPhotos(): void {
    const requests = this.photoService.listPhotos(this.cluster.category);
    this.loading = true;
    forkJoin(requests).subscribe((responses) => {
      responses.forEach((resp) => {
        this.photos = resp.data;
        this.displayedPhotos = this.photos.slice(0, 3);
        this.categoryName = resp.categoryName;
        this.getPhotoFiles();
      });
    });
  }

  getPhotoFiles(): void {
    const request = this.photos.map((photo) =>
      this.minioService.getPhoto(photo.href)
    );
    forkJoin(request)
      .pipe(
        catchError(() => of(false)),
        finalize(() => {
          // leave time for photos to load nicely
          setTimeout(() => {
            this.loading = false;
          }, 1500);
        })
      )
      .subscribe((responses) => {
        if (responses === false) {
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

  sanitizeUrl(url: string): string {
    return this.sanitizer.bypassSecurityTrustUrl(url) as string;
  }
}
