import { Injectable } from '@angular/core';
import {
  AUTH_DATA,
  AuthData,
  AuthResponse,
  Login,
  Logout,
  Register,
  USER_DATA,
  UserData,
} from './auth.model';
import { BehaviorSubject, Observable, finalize, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from 'src/app/shared/models/user.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UserService } from 'src/app/shared/services/user.service';
import { generateNewUser } from 'src/app/shared/helpers/user.helpers';
import { ModalService } from 'src/app/shared/modal/modal.service';

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class AuthService {
  data: UserData | null = null;
  tokenData: UserData | null = null;
  loggedInUser: User | null = null;
  authenticated: BehaviorSubject<boolean>;
  jwt = new JwtHelperService();
  finalAuthData = new BehaviorSubject({
    access_token: '',
    refresh_token: '',
  } as AuthData);

  refreshTokenInProgress = false;
  refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  prevNavigationUrl?: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private usersService: UserService,
    private modalService: ModalService
  ) {
    this.data = this.token || null;
    this.authenticated = new BehaviorSubject<boolean>(this.isAuthenticated);
  }

  get userData(): UserData | null {
    return this.data;
  }

  get user(): User | null {
    if (this.loggedInUser?.id !== undefined) {
      return this.loggedInUser;
    } else {
      this.loggedInUser = generateNewUser(
        JSON.parse(localStorage.getItem(USER_DATA) as string)
      );
      return this.loggedInUser;
    }
  }

  get isAuthenticated(): boolean {
    const status = !!localStorage.getItem(AUTH_DATA);
    return status;
  }

  get token(): UserData | false {
    try {
      return JSON.parse(localStorage.getItem(AUTH_DATA) as string);
    } catch (e) {
      return false;
    }
  }

  get accessToken(): string | null {
    const authData = JSON.parse(localStorage.getItem(AUTH_DATA) as string);
    return authData?.tokens.access_token;
  }

  get refreshToken(): string | null {
    const authData = JSON.parse(localStorage.getItem(AUTH_DATA) as string);
    return authData?.tokens.refresh_token;
  }

  login(data: Login): Observable<any> {
    return this.http.post<AuthResponse>('auth/login', data).pipe(
      tap((resp) => {
        this.setUserAndTokenData(resp.data);
        this.setStorageData(true, true);
        this.authenticated.next(this.isAuthenticated);
      })
    );
  }

  register(data: Register): Observable<any> {
    return this.http.post<AuthResponse>('auth/register', data).pipe(
      tap((resp) => {
        this.setUserAndTokenData(resp.data);
        this.setStorageData(true, true);
        this.authenticated.next(this.isAuthenticated);
      })
    );
  }

  refreshTokens(): Observable<any> {
    this.refreshTokenInProgress = true;
    this.refreshTokenSubject.next(false);
    return this.http
      .post<any>('auth/refresh', {
        access_token: this.accessToken,
        refresh_token: this.refreshToken,
      })
      .pipe(
        finalize(() => {
          this.refreshTokenInProgress = false;
        }),
        tap((data) => {
          this.finalAuthData.next(data.data);
          this.setUserAndTokenData(data.data);
          this.setStorageData(false, true);
          this.refreshTokenSubject.next(true);
        })
      );
  }

  logout(): Observable<any> {
    return this.http
      .post<Logout>('auth/logout', { refresh_token: this.refreshToken })
      .pipe(
        finalize(() => {
          this.unsetUserData();
          this.authenticated.next(this.isAuthenticated);
          this.router.navigate(['/welcome']);
          this.modalService.dismissAll();
        })
      );
  }

  setUserAndTokenData(tokens: AuthData): void {
    const token = this.jwt.decodeToken(tokens.access_token);
    const tokenData = { ...tokens, storedAt: Date.now() };
    this.data = { user: token, tokens: tokenData };
    console.log(this.data);
  }

  setStorageData(setUserData: boolean, setAuthData: boolean): void {
    if (setUserData) {
      this.usersService
        .getUser(this.data?.user.sub as string)
        .pipe(untilDestroyed(this))
        .subscribe((resp) => {
          localStorage.setItem(USER_DATA, JSON.stringify(resp));
          this.loggedInUser = generateNewUser(resp);
        });
    }
    if (setAuthData) {
      localStorage.setItem(AUTH_DATA, JSON.stringify(this.data));
    }
  }

  unsetUserData(): void {
    this.data = null;
    localStorage.removeItem(AUTH_DATA);
    localStorage.removeItem(USER_DATA);
  }
}
