import { Injectable } from '@angular/core';
import { AUTH_DATA, UserData } from './auth.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  data: UserData | null = {
    tokens: { access_token: '', refresh_token: '', storedAt: 2 },
  }; // testing purposes
  // data = null;
  prevNavigationUrl?: string;
  authenticated: BehaviorSubject<boolean>;

  constructor() {
    this.authenticated = new BehaviorSubject<boolean>(this.isAuthenticated);
  }

  get isAuthenticated(): boolean {
    const status = !!!localStorage.getItem(AUTH_DATA); // extra ! for testing
    return status;
  }
}
