import { Component, inject } from '@angular/core';

import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private _authService = inject(AuthService);
  private _router = inject(Router);

  cerrarSesion() {
    this._authService.doLogout()
    .then(() => {
      this._router.navigateByUrl('/auth/login');
    })
    .catch(() => console.log('Error al cerrar sesión!'));
  }
}
