import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Login } from '../shared/auth.model';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent implements OnInit {
  loginForm!: UntypedFormGroup;
  error?: string;
  loading = false;

  showPassword = false;
  emailFocused = false;
  passwordFocused = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.createForm();
  }

  ngOnInit(): void {}

  private createForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  submit(): void {
    this.error = undefined;
    this.loading = true;

    let data: Login = {
      email: this.loginForm.controls['email'].value,
      password: this.loginForm.controls['password'].value,
    };

    this.authService
      .login(data)
      .pipe(
        finalize(() => {
          this.loginForm.markAsPristine();
          this.loading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        () => {
          this.router.navigate(['../dashboard']);
        },
        (err) => {
          this.error = err.error.detail;
        }
      );
  }
}
