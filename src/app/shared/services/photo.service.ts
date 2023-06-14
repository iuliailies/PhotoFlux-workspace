import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, mergeMap } from 'rxjs';
import {
  CreatePhotoRequest,
  CreatePhotoResponse,
  ListMyPhotoResponse,
  ListPhotosResponse,
  Photo,
  Photos,
  PhotosPerCategory,
} from '../models/photo.model';
import {
  generateNewPhoto,
  generateNewPhotoFromListItem,
} from '../helpers/photo.helpers';
import { MinioService } from './minio.service';
import { PAGINATION } from '../models/params.model';

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

  listMyPhotos(next?: string): Observable<Photos> {
    return this.http
      .get<ListMyPhotoResponse>(
        next || this.requestURL + 'me/?limit=' + PAGINATION.LIMIT
      )
      .pipe(
        map((resp) => {
          const photos: Photos = {
            data: resp.data.map((item) => generateNewPhotoFromListItem(item)),
            next: resp.links?.next,
            numberPhotos: resp.meta.number_photos,
            numberStars: resp.meta.number_stars,
          };
          return photos;
        })
      );
  }

  listPhotos(
    categoryId: string,
    sortType: string,
    next?: string
  ): Observable<PhotosPerCategory> {
    let params = { params: new HttpParams() };
    if (next === undefined) {
      params = {
        params: new HttpParams()
          .set('category', categoryId)
          .set('sort', sortType),
      };
    }
    // const params = { params: new HttpParams().set('category', categoryId) };
    return this.http
      .get<ListPhotosResponse>(
        next || this.requestURL + '?limit=' + PAGINATION.LIMIT,
        params
      )
      .pipe(
        map((resp) => {
          const photos: PhotosPerCategory = {
            data: resp.data.map((item) => generateNewPhotoFromListItem(item)),
            next: resp.links.next,
            categoryName: resp.meta.category_name,
          };
          return photos;
        })
      );
  }
}
