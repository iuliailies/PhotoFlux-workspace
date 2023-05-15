import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, mergeMap } from 'rxjs';
import {
  CreatePhotoRequest,
  CreatePhotoResponse,
  ListMyPhotoResponse,
  Photo,
  Photos,
} from '../models/photo.model';
import {
  generateNewPhoto,
  generateNewPhotoFromListItem,
} from '../helpers/photo.helpers';
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

  listMyPhotos(): Observable<Photos> {
    return this.http.get<ListMyPhotoResponse>(this.requestURL + 'me/').pipe(
      map((resp) => {
        const photos: Photos = {
          data: resp.data.map((item) => generateNewPhotoFromListItem(item)),
          numberPhotos: resp.meta.number_photos,
          numberStars: resp.meta.number_stars,
        };
        return photos;
      })
    );
  }
}
