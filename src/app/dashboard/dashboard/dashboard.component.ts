import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalService } from 'src/app/shared/modal/modal.service';
import { CreateDashboardModalComponent } from '../create-dashboard-modal/create-dashboard-modal.component';
import { Board } from 'src/app/shared/models/board.model';
import * as canvaSketcher from '@iuliailies/canva-sketcher';
import { BoardService } from 'src/app/shared/services/board.service';
import {
  TOAST_STATE,
  ToastService,
} from 'src/app/shared/components/toast/toast.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { formatDistanceToNow } from 'date-fns';
import { arrangeClusters } from 'src/app/shared/helpers/arrange-clusters';

@UntilDestroy()
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('zoomableContainer') zoomableContainer!: ElementRef;
  @ViewChild('zoomable') zoomable!: ElementRef;
  id?: string;
  board?: Board;
  zoomEnv?: canvaSketcher.ZoomEnvironment;
  panEnv?: canvaSketcher.PanEnvironment;
  photosLoading = false;
  photosError = false;
  zoom: number = 1;
  focusedCluster = -1;
  saving = false;
  recentlySaved = false;
  clusters?: canvaSketcher.Selection;

  constructor(
    private modalService: ModalService,
    private boardService: BoardService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') as string;
    if (this.id) {
      this.getBoard();
    }
    this.router.events
      .pipe(
        filter((ev) => ev instanceof NavigationEnd),
        untilDestroyed(this)
      )
      .subscribe(() => {
        this.id = this.route.snapshot.paramMap.get('id') as string;
        if (this.id) {
          this.getBoard();
        }
      });
  }

  getBoard(): void {
    if (!this.id) return;
    this.boardService.getBoard(this.id).subscribe(
      (resp) => {
        this.board = resp;
        setTimeout(() => {
          this.initializeZoomEnvironment();
          this.sketch();
        });
      },
      (err) => {
        this.toastService.showToast(TOAST_STATE.danger, [
          { toastMessage: `<div>Error loading board data.</div>` },
        ]);
      }
    );
  }

  initializeZoomEnvironment(): void {
    if (!this.board || this.zoomEnv) return;

    this.zoomEnv = canvaSketcher
      .zoom(
        this.zoomableContainer.nativeElement,
        this.zoomable.nativeElement,
        1
      )
      .apply({
        lowerBound: 0.5,
        upperBound: 2,
        method: {
          type: 'mouse',
          ctrlKey: true,
        },
      })
      .on('zoom', (ev: Event, zoom: number) => {
        ev.preventDefault();
        this.zoom = zoom;
      });

    this.panEnv = this.zoomEnv
      .pannable()
      .on('start', () => {
        this.zoomableContainer.nativeElement.classList.add('panning');
      })
      .on('end', () => {
        this.zoomableContainer.nativeElement.classList.remove('panning');
      });
  }

  sketch(): void {
    if (!this.board || !this.zoomEnv) return;
    let self = this;

    this.clusters = canvaSketcher.selectAll('.cluster');
    const dragEnv = new canvaSketcher.DragEnvironment()
      .apply(this.clusters, { threshold: 100, disableEvents: true })
      .on('end', function (eventObj: Event, data: any, index: number) {
        self.board!.clusters[index]!.position = {
          x: parseInt(this.style.left, 10) || 0,
          y: parseInt(this.style.top, 10) || 0,
        };
        self.updateBoard();
      });
    const zoomEnv = this.zoomEnv;
    const panEnv = this.panEnv;

    this.clusters.on(
      'dblclick',
      function (eventObj: Event, data: any, i: number) {
        zoomEnv
          .focus(
            this,
            {
              transitionDuration: 0.4,
              boundary: 0.04,
            },
            this.querySelector('.action-icon') as HTMLElement,
            {
              key: 'Escape',
            }
          )
          .on('AnimationOpenStart', function () {
            this.element.classList.add('focusing');
            dragEnv.disabled = true;
            panEnv!.disabled = true;
          })
          .on('AnimationOpenEnd', function () {
            this.element.classList.remove('focusing');
            this.element.classList.add('focused');
            self.focusedCluster = i;
          })
          .on('AnimationCloseStart', function () {
            this.element.classList.remove('focused');
            dragEnv.disabled = false;
            panEnv!.disabled = false;
            self.focusedCluster = -1;
          });
      }
    );
  }

  get updatedAtFromNow(): string {
    if (!this.board) {
      return '-';
    }
    return formatDistanceToNow(new Date(this.board.updatedAt)) + ' ago';
  }

  openCreateModal(): void {
    const modalRef = this.modalService.open(CreateDashboardModalComponent);

    modalRef.result.then(
      (resp) => {
        this.router.navigate([`/dashboard/${resp.id}`]);
      },
      () => {}
    );
  }

  updateBoard(): void {
    this.saving = true;
    this.boardService
      .updateBoard(this.board!.board.id, this.board!.name, this.board!.clusters)
      .subscribe(
        (resp) => {
          this.saving = false;
          this.recentlySaved = true;
          setTimeout(() => {
            this.recentlySaved = false;
          }, 5000);
          this.board!.updatedAt = new Date();
        },
        (error) => {
          this.toastService.showToast(TOAST_STATE.danger, [
            { toastMessage: `<div>Error updating board layout.</div>` },
          ]);
        }
      );
  }

  arrangeClusters(): void {
    if (!this.board) {
      return;
    }
    arrangeClusters(this.board.clusters);
    this.clusters?.style('left', (data: any, i: number) => {
      return this.board?.clusters[i].position.x + 'px';
    });
    this.clusters?.style('top', (data: any, i: number) => {
      return this.board?.clusters[i].position.y + 'px';
    });

    this.zoomEnv?.reset();

    this.updateBoard();
  }
}
