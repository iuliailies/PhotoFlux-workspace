import { Component, OnInit } from '@angular/core';
import { ActiveModal } from '../../modal/modal-ref.class';
import { Photo } from '../../models/photo.model';

@Component({
  selector: 'app-inspect-photo-modal',
  templateUrl: './inspect-photo-modal.component.html',
  styleUrls: ['./inspect-photo-modal.component.sass'],
})
export class InspectPhotoModalComponent implements OnInit {
  photo!: Photo;

  constructor(public activeModal: ActiveModal) {}

  ngOnInit(): void {}
}
