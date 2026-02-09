import { HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    tap((event) => {
      if (event.type === HttpEventType.Response) {
        console.log(req.url, ' response with status ', event.status);
      }
    }),
    catchError((error) => {
      console.log(error);
      alert(error.error.message);
      return throwError(() => error);
    }),
  );
};
