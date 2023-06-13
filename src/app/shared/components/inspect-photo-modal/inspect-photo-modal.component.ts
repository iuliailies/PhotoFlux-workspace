import { Component, OnInit } from '@angular/core';
import { ActiveModal } from '../../modal/modal-ref.class';
import { Photo } from '../../models/photo.model';
import { StarService } from '../../services/star.service';
import { TOAST_STATE, ToastService } from '../toast/toast.service';

@Component({
  selector: 'app-inspect-photo-modal',
  templateUrl: './inspect-photo-modal.component.html',
  styleUrls: ['./inspect-photo-modal.component.sass'],
})
export class InspectPhotoModalComponent implements OnInit {
  photo!: Photo;

  constructor(
    public activeModal: ActiveModal,
    private starService: StarService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {}

  starPhoto(): void {
    this.starService.starPhoto(this.photo.id).subscribe(
      (resp) => {
        this.photo.starred = resp;
        this.photo.numberStars += resp ? 1 : -1;
      },
      (err) => {
        this.toastService.showToast(TOAST_STATE.danger, [
          { toastMessage: `<div>Error starring photo.</div>` },
        ]);
      }
    );
  }

  downloadPhoto(): void {
    const a = document.createElement('a');
    const fileUrl = URL.createObjectURL(this.photo.file!);
    a.href = fileUrl;
    a.download = 'new_download.jpg';
    a.click();
    URL.revokeObjectURL(fileUrl);
  }
}
