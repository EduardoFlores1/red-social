import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { UserAuthService } from '../services/user-auth.service';

export const securityInnerGuard: CanActivateFn = (route, state) => {
  const _userAuthService = inject(UserAuthService);
  const _router = inject(Router);

  return _userAuthService.getCurrentUserAuth().pipe(
    map(user => {
      if (user) {
        return true; // -> /inicio
      } else {
        _router.navigateByUrl('/auth/login');
        return false; // Redirije y bloquea
      }
    })
  );
};
