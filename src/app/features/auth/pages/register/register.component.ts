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

  registerForm!: FormGroup;
  sigErrorMessage = signal<String>('');
  sigErrorUsername = signal<String>('');
  sigErrorEmail = signal<String>('');
  sigErrorPassword = signal<String>('');

  constructor(private _fb: FormBuilder, private _router: Router) {
    this.createForm();
  }

  createForm() {
    this.registerForm = this._fb.group({
      displayName: [
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
    if(this.f['displayName'].hasError('required')) {
      this.sigErrorUsername.set('El username es requerido');
    } else if(this.f['displayName'].hasError('minlength')) {
      this.sigErrorUsername.set('Mín 5 caracteres');
    }else if(this.f['displayName'].hasError('maxlength')) {
      this.sigErrorUsername.set('Max 25 caracteres');
    }else {
      this.sigErrorUsername.set('');
    }
  }

  updateErrorMessageEmail() {
    if(this.f['email'].hasError('required')) {
      this.sigErrorEmail.set('El email es requerido');
    } else if(this.f['email'].hasError('email')) {
      this.sigErrorEmail.set('Email no válido');
    } else {
      this.sigErrorEmail.set('');
    }
  }

  updateErrorMessagePassword() {
    if(this.f['password'].hasError('required')) {
      this.sigErrorPassword.set('El password es requerido');
    } else if(this.f['password'].hasError('minlength')) {
      this.sigErrorPassword.set('Mín 8 caracteres');
    }else if(this.f['password'].hasError('maxlength')) {
      this.sigErrorPassword.set('Max 16 caracteres');
    }else {
      this.sigErrorPassword.set('');
    }
  }

  tryRegister() {
    this._authService
      .doRegister(this.registerForm.value)
      .then(() => {
        this._router.navigateByUrl('/auth/login');
        console.log('Usuario registrado con éxito!');
      })
      .catch((err: Error) => {
        this.sigErrorMessage.set(err.message);
        console.log(err.message);
      });
  }
}
