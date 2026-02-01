import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, switchMap, take } from 'rxjs';

import { AuthService } from '../services/auth-service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const isAuth$ = authService.isAuthenticated();
  return isAuth$.pipe(
    // isAuth$ is undefined until "loadUserState()" is executed
    filter((succes) => succes !== undefined),
    // close observable after the first value is received
    take(1),
    map((success) => {
      if (!success) return router.createUrlTree(['/login']);
      return true;
    }),
  );
};
