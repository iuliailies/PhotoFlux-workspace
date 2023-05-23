import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { StarPhotoRequest, StarPhotoResponse } from '../models/star.model';

@Injectable({
  providedIn: 'root',
})
export class StarService {
  private requestURL = 'stars/';

  constructor(private http: HttpClient) {}

  starPhoto(id: string): Observable<boolean> {
    return this.http
      .post<StarPhotoResponse>(this.requestURL, {
        photo_id: id,
      })
      .pipe(map((resp) => resp.is_star));
  }
}
