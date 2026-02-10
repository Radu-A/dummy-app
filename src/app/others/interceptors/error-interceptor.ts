import { HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { ErrorService } from '../../services/error-service';
import { AuthService } from '../../services/auth-service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const service = inject(ErrorService);
  const authService = inject(AuthService);
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
          // Chrome inspector / Network / No throttling
          service.setError(
            true,
            `We were unable to connect to the server. Please check your internet connection and try again`,
          );
          setTimeout(() => {
            authService.logout();
          }, 500);
          break;
        case error.status >= 500:
          service.setError(
            true,
            `An unexpected problem occurred with our services. We are working on it`,
          );
          break;
        case error.status === 401:
          // Use "INVALID_TOKEN" in token-interceptor
          service.setError(true, `Session expired`);
          break;
        case error.status === 403:
          service.setError(true, `You do not have permission to perform this action`);
          break;
        case error.status === 404:
          // Corrupt "productsUrl" in product-service
          service.setError(true, `We haven't found what you were searching`);
          break;
        default:
          service.setError(true, `Unknown error: ${error.message}`);
          break;
      }

      return throwError(() => error);
    }),
  );
};
