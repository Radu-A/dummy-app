import { HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, tap, throwError } from 'rxjs';
import { ErrorService } from '../../services/error-service';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorService);
  const authService = inject(AuthService);
  const router = inject(Router);
  return next(req).pipe(
    tap((event) => {
      if (event.type === HttpEventType.Response) {
        console.log(req.url, ' response with status ', event.status);
      }
    }),
    catchError((error) => {
      console.error(error);

      switch (true) {
        case error.status === 0:
          // FORCE ERROR: Chrome inspector / Network / No throttling
          errorService.setError(
            true,
            `We were unable to connect to the server. Please check your internet connection and try again`,
          );
          //
          setTimeout(() => {
            authService.logout();
          }, 500);
          break;
        case error.status >= 500:
          errorService.setError(
            true,
            `An unexpected problem occurred with our services. We are working on it`,
          );
          break;
        case error.status === 401:
          // FORCE ERROR: Use "INVALID_TOKEN" in token-interceptor
          return authService.refreshSession().pipe(
            switchMap((newSession) => {
              const newReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newSession.accessToken}` },
              });
              return next(newReq);
            }),
            catchError((refreshError) => {
              errorService.setError(true, `Session expired`);
              setTimeout(() => {
                authService.logout();
              }, 500);
              return throwError(() => refreshError);
            }),
          );
        case error.status === 403:
          errorService.setError(true, `You do not have permission to perform this action`);
          break;
        case error.status === 404:
          // If the error is in the URL, app.routes redirect to NotFoundPage, else:
          // FORCE ERROR: Navigate to http://localhost:4200/products/details/666
          // Redirect to NotFoundPage, instead of show modal
          router.navigate(['/notfound'], {
            queryParams: {
              type: 'api',
            },
          });
          break;
        default:
          errorService.setError(true, `Unknown error: ${error.message}`);
          break;
      }
      return throwError(() => error);
    }),
  );
};
