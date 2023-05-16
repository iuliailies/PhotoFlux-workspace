import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-auth-wrapper',
  templateUrl: './auth-wrapper.component.html',
  styleUrls: ['./auth-wrapper.component.sass'],
})
export class AuthWrapperComponent implements OnInit {
  @ViewChild('toggle') toggle!: ElementRef;
  isRotated = false;

  constructor(private auth: AuthService, private renderer: Renderer2) {
    this.isRotated = this.auth.prevNavigationUrl === '/register';
  }

  ngOnInit(): void {}

  switch(): void {
    this.isRotated = !this.isRotated;
  }
}
