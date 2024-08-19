import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map} from 'rxjs';
import { UserAuthService } from '../services/user-auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const _userAuthService = inject(UserAuthService);
  const _router = inject(Router);

  return _userAuthService.getCurrentUserAuth().pipe(
    map(user => {
      if (user) {
        _router.navigateByUrl('/inicio');
        return false; // Redirige y bloquea login o register
      } else {
        return true; // no usuario -> deja entrar al login o register
      }
    })
  );
};
