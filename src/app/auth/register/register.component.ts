import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Register } from '../shared/auth.model';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass'],
})
export class RegisterComponent implements OnInit {
  registerForm!: UntypedFormGroup;
  error?: string;
  loading = false;

  showPassword = false;
  emailFocused = false;
  nameFocused = false;
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
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  submit(): void {
    this.error = undefined;
    this.loading = true;

    let data: Register = {
      name: this.registerForm.controls['name'].value,
      email: this.registerForm.controls['email'].value,
      password: this.registerForm.controls['password'].value,
    };

    this.authService
      .register(data)
      .pipe(
        finalize(() => {
          this.registerForm.markAsPristine();
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
