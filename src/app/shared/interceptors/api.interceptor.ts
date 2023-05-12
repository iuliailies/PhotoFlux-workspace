import { Injectable, Provider } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/auth/shared/auth.service';

@Injectable({ providedIn: 'root' })
export class ApiInterceptor implements HttpInterceptor {
  constructor(public auth: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const url = `${environment.apiURL}/${request.url}`;
    request = request.clone({ url });
    request.headers.set(
      'Authorization',
      `Bearer ${
        this.auth.accessToken
          ? this.auth.accessToken
          : this.auth.userData?.tokens.access_token
      }`
    );
    return next.handle(request);
  }
}

export const ApiInterceptorProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ApiInterceptor,
  multi: true,
};
