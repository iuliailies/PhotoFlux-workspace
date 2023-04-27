import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthWrapperComponent } from './auth-wrapper/auth-wrapper.component';

@NgModule({
  declarations: [LoginComponent, RegisterComponent, AuthWrapperComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [],
})
export class AuthModule {}
