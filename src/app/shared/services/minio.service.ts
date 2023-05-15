import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';

// service used for interaction with the minio storage, follows the presigned url approach
// https://min.io/docs/minio/linux/integrations/presigned-put-upload-via-browser.html

@Injectable({
  providedIn: 'root',
})
export class MinioService {
  private http!: HttpClient;
  constructor(private handler: HttpBackend) {
    // bypass http interceptor
    this.http = new HttpClient(handler);
  }

  uploadPhoto(url: string, photo: File): Observable<any> {
    return this.http.put<any>(url, photo);
  }

  getPhoto(url: string): Observable<any> {
    return this.http.get(url, { responseType: 'blob' });
  }
}
