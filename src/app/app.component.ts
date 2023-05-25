import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, filter } from 'rxjs';
import { AuthService } from './auth/shared/auth.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
  title = 'PhotoFlux';
  prevUrl?: string;
  loggedIn: Observable<boolean>;
  isPortfolioOpen = false;
  isBoardsOpen = false;

  constructor(private auth: AuthService, private router: Router) {
    this.loggedIn = this.auth.authenticated
      .asObservable()
      .pipe(untilDestroyed(this));
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter((ev) => ev instanceof NavigationStart))
      .subscribe((ev) => {
        this.auth.prevNavigationUrl = (ev as NavigationStart).url;
      });
  }
}
