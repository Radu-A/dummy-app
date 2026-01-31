import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { map } from 'rxjs';

import { AuthService } from '../services/auth-service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const isAuth$ = authService.isAuthenticated();
  return isAuth$.pipe(
    map((success) => {
      if (!success) return router.createUrlTree(['/login']);
      return true;
    }),
  );
};
