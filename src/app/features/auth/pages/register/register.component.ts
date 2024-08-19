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
  selector: 'app-register',
  standalone: true,
  imports: [
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private _authService = inject(AuthService);
  private _progressRequestService = inject(ProgressRequestService);
  private _snackBarService = inject(SnackbarRequestService);

  registerForm!: FormGroup;
  sigErrorUsername = signal<String>('');
  sigErrorEmail = signal<String>('');
  sigErrorPassword = signal<String>('');

  constructor(private _fb: FormBuilder, private _router: Router) {
    this.createForm();
  }

  private createForm() {
    this.registerForm = this._fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(25),
        ],
      ],
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
    return this.registerForm.controls;
  }

  updateErrorMessageUsername() {
    if (this.f['username'].hasError('required')) {
      this.sigErrorUsername.set('El username es requerido');
    } else if (this.f['username'].hasError('minlength')) {
      this.sigErrorUsername.set('Mín 5 caracteres');
    } else if (this.f['username'].hasError('maxlength')) {
      this.sigErrorUsername.set('Max 25 caracteres');
    } else {
      this.sigErrorUsername.set('');
    }
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

  tryRegister() {
    if (this.registerForm.valid) {
      this._progressRequestService.open();
      this._authService
        .doRegister(this.registerForm.value)
        .then(() => {
          this._router.navigateByUrl('/inicio');
          console.log('Usuario registrado con éxito!');
        })
        .catch((err: Error) => {
          this._snackBarService.open(err.message, 'Error')
          console.log(err.message);
        })
        .finally(() => this._progressRequestService.close());
    }
  }
}
 