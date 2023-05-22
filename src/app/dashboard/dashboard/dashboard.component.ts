import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ModalService } from 'src/app/shared/modal/modal.service';
import { CreateDashboardModalComponent } from '../create-dashboard-modal/create-dashboard-modal.component';
import { Board } from 'src/app/shared/models/board.model';
import * as canvaSketcher from '@iuliailies/canva-sketcher';
import { PhotoService } from 'src/app/shared/services/photo.service';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { MinioService } from 'src/app/shared/services/minio.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('zoomableContainer') zoomableContainer!: ElementRef;
  @ViewChild('zoomable') zoomable!: ElementRef;
  board?: Board;
  zoomEnv?: canvaSketcher.ZoomEnvironment;
  photosLoading = false;
  photosError = false;

  constructor(
    private modalService: ModalService // private photoService: PhotoService, // private minioService: MinioService, // private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initializeZoomEnvironment();
    this.sketch();
  }

  initializeZoomEnvironment(): void {
    if (!this.board) return;

    this.zoomEnv = canvaSketcher
      .zoom(
        this.zoomableContainer.nativeElement,
        this.zoomable.nativeElement,
        1
      )
      .apply({
        lowerBound: 1,
        upperBound: 1,
        method: {
          type: 'mouse',
          ctrlKey: true,
        },
      })
      .on(
        'zoom',
        function (ev: Event, zoom: number, target: HTMLElement | any) {
          ev.preventDefault();
        }
      );
  }

  sketch(): void {
    if (!this.board || !this.zoomEnv) return;

    const clusters = canvaSketcher.selectAll('.cluster');
    const dragEnv = new canvaSketcher.DragEnvironment().apply(clusters);
    const zoomEnv = this.zoomEnv;

    clusters.on('dblclick', function () {
      zoomEnv
        .focus(
          this,
          {
            transitionDuration: 0.4,
            boundary: 0.05,
          },
          this.querySelector('.action-icon') as HTMLElement,
          {
            key: 'Escape',
          }
        )
        .on('AnimationOpenStart', function () {
          this.element.classList.add('focusing');
          dragEnv.disabled = true;
        })
        .on('AnimationOpenEnd', function () {
          this.element.classList.remove('focusing');
          this.element.classList.add('focused');
        })
        .on('AnimationCloseStart', function () {
          this.element.classList.remove('focused');
          dragEnv.disabled = false;
        });
    });
  }

  openCreateModal(): void {
    const modalRef = this.modalService.open(CreateDashboardModalComponent);

    modalRef.result.then(
      (resp) => {
        this.board = resp;
        // this.getPhotos();
        // make call assynchronous, such that the clusters can be rendered first
        setTimeout(() => {
          this.initializeZoomEnvironment();
          this.sketch();
        });
      },
      () => {}
    );
  }

  // getPhotos(): void {
  //   if (!this.board) return;
  //   const requests = this.board.categoryIds.map((cId) =>
  //     this.photoService.listPhotos(cId)
  //   );
  //   this.photosLoading = true;
  //   forkJoin(requests).subscribe((responses) => {
  //     responses.forEach((resp, index) => {
  //       this.board!.photos[index] = resp.data;
  //       this.getPhotoFiles(index);
  //     });
  //   });
  // }

  // getPhotoFiles(clusterIndex: number): void {
  //   const request = this.board!.photos[clusterIndex].map((photo) =>
  //     this.minioService.getPhoto(photo.href)
  //   );
  //   forkJoin(request)
  //     .pipe(
  //       catchError(() => of(false)),
  //       finalize(() => {
  //         this.photosLoading = false;
  //       })
  //     )
  //     .subscribe((responses) => {
  //       if (responses === false) {
  //         return;
  //       }
  //       (responses as any[]).forEach((resp, index) => {
  //         this.board!.photos[clusterIndex][index].file = new File([resp], '');
  //         this.board!.photos[clusterIndex][index].url = this.sanitizeUrl(
  //           URL.createObjectURL(this.board!.photos[clusterIndex][index].file!)
  //         );
  //       });
  //     });
  // }

  // sanitizeUrl(url: string): string {
  //   return this.sanitizer.bypassSecurityTrustUrl(url) as string;
  // }
}
