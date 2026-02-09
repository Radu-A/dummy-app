import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { environment } from '../../../environments/environment.development';

import { AuthService } from '../../services/auth-service';
import { catchError, switchMap, throwError } from 'rxjs';

// Force "Invalid/Expired Token!" response
const INVALID_TOKEN = 'thisissuperfake!';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const sessionData$ = authService.sessionData$;

  // Filter rotes that not require token
  if (!req.url.startsWith(`${environment.apiUrl}/auth/products/`)) return next(req);

  // CASE 1 - No available data
  if (!sessionData$.value.data) return next(req);

  // CASE 2 - Expired token
  if (sessionData$.value.data.expiresAt < Date.now()) {
    console.log('CASE 2 - Expired token');

    return authService.refreshSession().pipe(
      switchMap((newSessionData) => {
        console.log('Refresco completado. Reintentando petición original con nuevo token.');
        // Not allowed to change a request, clone is required
        const authorizedReq = req.clone({
          // Not allowed to change a request, clone is required
          headers: req.headers.append('Authorization', `Bearer ${newSessionData.accessToken}`),
        });

        // Check that token change every 5 seconds
        // console.log(
        //   `Token interceptor - injecting token in headers requests: ${sessionData$.value.data?.accessToken}`,
        // );

        return next(authorizedReq);
      }),
      catchError((err) => {
        console.error('Refresh token failed');
        return throwError(() => err);
      }),
    );
  }
  // CASE 3 - El token es válido, seguimos normal
  const authorizedReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${sessionData$.value.data.accessToken}`,
    },
  });

  return next(authorizedReq);
};
