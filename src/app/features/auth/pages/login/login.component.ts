import { Component, inject, signal } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { ProgressRequestService } from '../../../../core/services/progress-request.service';
import { SnackbarRequestService } from '../../../../core/services/snackbar-request.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private _authService = inject(AuthService);
  private _progressRequest = inject(ProgressRequestService);
  private _snackBarService = inject(SnackbarRequestService);

  loginForm!: FormGroup;
  hidePassword: boolean = true;
  sigErrorEmail = signal<String>('');
  sigErrorPassword = signal<String>('');

  constructor(private _fb: FormBuilder, private _router: Router) {
    this.createForm();
  }

  private createForm() {
    this.loginForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(16),
        ],
      ],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  updateErrorMessageEmail() {
    if (this.f['email'].hasError('required')) {
      this.sigErrorEmail.set('El email es requerido');
    } else if (this.f['email'].hasError('email')) {
      this.sigErrorEmail.set('Email no válido');
    } else {
      this.sigErrorEmail.set('');
    }
  }

  updateErrorMessagePassword() {
    if (this.f['password'].hasError('required')) {
      this.sigErrorPassword.set('El password es requerido');
    } else if (this.f['password'].hasError('minlength')) {
      this.sigErrorPassword.set('Mín 8 caracteres');
    } else if (this.f['password'].hasError('maxlength')) {
      this.sigErrorPassword.set('Max 16 caracteres');
    } else {
      this.sigErrorPassword.set('');
    }
  }

  tryLogin() {
    if (this.loginForm.valid) {
      this._progressRequest.open();
      this._authService
        .doLogin(this.loginForm.value)
        .then(() => {
          this._router.navigateByUrl('/inicio');
          console.log('Usuario logueado exitosamente!');
        })
        .catch((err: Error) => {
          this._snackBarService.open(err.message, 'Error')
          console.log(err.message);
        })
        .finally(() => this._progressRequest.close());
    }
  }
}
