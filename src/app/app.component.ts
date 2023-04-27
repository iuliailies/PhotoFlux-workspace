import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './auth/shared/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
  title = 'PhotoFlux';
  prevUrl?: string;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((ev) => ev instanceof NavigationStart))
      .subscribe((ev) => {
        this.auth.prevNavigationUrl = (ev as NavigationStart).url;
      });
  }
}
