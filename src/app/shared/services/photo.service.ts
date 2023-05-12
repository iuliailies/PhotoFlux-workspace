import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  CreatePhotoRequest,
  CreatePhotoResponse,
  Photo,
} from '../models/photo.model';
import { AuthService } from 'src/app/auth/shared/auth.service';
import { generateNewPhoto } from '../helpers/photo.helpers';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private requestURL = 'http://localhost:8033/api/photos/';

  constructor(private http: HttpClient, private auth: AuthService) {}

  uploadPhoto(link: string, categoryIds: string[]): Observable<Photo> {
    const request: CreatePhotoRequest = {
      link: link,
      // user_id: this.auth.data?.user.id,
      user_id: '',
      category_ids: categoryIds,
    };
    return this.http
      .post<CreatePhotoResponse>(this.requestURL, request)
      .pipe(map((resp) => generateNewPhoto(resp)));
  }
}
