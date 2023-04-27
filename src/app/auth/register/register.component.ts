import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass'],
})
export class RegisterComponent implements OnInit {
  registerForm!: UntypedFormGroup;
  error?: string;

  showPassword = false;
  emailFocused = false;
  nameFocused = false;
  passwordFocused = false;

  constructor(private formBuilder: UntypedFormBuilder) {
    this.createForm();
  }

  ngOnInit(): void {}

  private createForm(): void {
    this.registerForm = this.formBuilder.group({
      email: ['', Validators.required],
      name: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  submit(): void {
    this.error = 'testing purposes';
  }
}
