import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Injectable, Provider } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/shared/auth.service';

@Injectable()
export class RequestTokenInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    request = this.addToken(request);

    return next.handle(request).pipe(
      catchError((error) => {
        if (
          request.url.endsWith('/login') ||
          request.url.endsWith('/refresh')
        ) {
          // check if refreshing token failed
          if (request.url.endsWith('/refresh')) {
            return this.auth.logout();
          }
          return throwError(error);
        }

        // if error code is different than 401 we want to skip refreshing token
        if (error.status !== 401) {
          return throwError(error);
        }

        if (this.auth.refreshTokenInProgress) {
          return this.auth.refreshTokenSubject.pipe(
            filter((result) => !!result),
            take(1),
            switchMap(() => {
              return next.handle(this.applyNewToken(request));
            })
          );
        } else {
          return this.auth.refreshTokens().pipe(
            switchMap(() => {
              return next.handle(this.applyNewToken(request));
            })
            // no need to catch errors here, since they will go through this interceptor anyway
          );
        }
      })
    );
  }

  private addToken(request: HttpRequest<any>): HttpRequest<any> {
    if (request.headers.has('Authorization')) {
      return request;
    }

    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${
          this.auth.accessToken
            ? this.auth.accessToken
            : this.auth.userData?.tokens.access_token
        }`,
      },
    });
  }

  private applyNewToken(request: HttpRequest<any>): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${
          this.auth.accessToken
            ? this.auth.accessToken
            : this.auth.userData?.tokens.access_token
        }`,
      },
    });
  }
}

export const RefreshTokenInterceptorProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: RequestTokenInterceptor,
  multi: true,
  deps: [AuthService],
};
