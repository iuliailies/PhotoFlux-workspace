import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { GetUserResponse, User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private requestURL = 'users/';

  constructor(private http: HttpClient) {}

  getUser(id?: string): Observable<GetUserResponse> {
    return this.http.get<GetUserResponse>(this.requestURL + id);
  }
}
