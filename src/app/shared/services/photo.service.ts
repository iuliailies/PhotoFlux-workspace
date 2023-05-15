import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, mergeMap } from 'rxjs';
import {
  CreatePhotoRequest,
  CreatePhotoResponse,
  Photo,
} from '../models/photo.model';
import { generateNewPhoto } from '../helpers/photo.helpers';
import { MinioService } from './minio.service';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private requestURL = 'photos/';

  constructor(private http: HttpClient, private minio: MinioService) {}

  uploadPhoto(categoryIds: string[], photo: File): Observable<Photo> {
    const request: CreatePhotoRequest = {
      category_ids: categoryIds,
    };
    let uploadedPhoto: Photo;
    return this.http
      .post<CreatePhotoResponse>(this.requestURL, request)
      .pipe(
        mergeMap((resp) => {
          uploadedPhoto = generateNewPhoto(resp);
          return this.minio.uploadPhoto(resp.data.meta.href, photo);
        })
      )
      .pipe(map(() => uploadedPhoto));
  }
}
