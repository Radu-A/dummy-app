import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth-service';

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const isAuth = await authService.isAuthenticated();
  if (!isAuth) {
    return router.createUrlTree(['/login']);
  }
  return true;
};
