import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './core/layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { securityInnerGuard } from './core/guards/security-inner.guard';

export const routes: Routes = [
  {
    path: '*',
    redirectTo: '/auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        title: 'PUYU - LOGIN',
        loadComponent: () =>
          import('./features/auth/pages/login/login.component').then(
            (c) => c.LoginComponent
          ),
        canActivate: [authGuard]
      },
      {
        path: 'register',
        title: 'PUYU - REGISTER',
        loadComponent: () =>
          import('./features/auth/pages/register/register.component').then(
            (c) => c.RegisterComponent
          ),
        canActivate: [authGuard]
      },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [securityInnerGuard],
    children: [
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full',
      },
      {
        path: 'inicio',
        title: 'PUYU - INICIO',
        loadComponent: () =>
          import('./features/inicio/pages/inicio/inicio.component').then(
            (c) => c.InicioComponent
          ),
      },
      {
        path: 'contactos',
        title: 'PUYU - CONTACTOS',
        loadComponent: () =>
          import(
            './features/contactos/pages/contactos/contactos.component'
          ).then((c) => c.ContactosComponent),
      },
    ],
  },
];
