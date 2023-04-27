import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent implements OnInit {
  loginForm!: UntypedFormGroup;
  error?: string;

  showPassword = false;
  emailFocused = false;
  passwordFocused = false;

  constructor(private formBuilder: UntypedFormBuilder) {
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
    this.error = 'testing purposes';
  }
}
