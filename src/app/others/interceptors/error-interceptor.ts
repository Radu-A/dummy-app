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
      console.error(error);
      if (error.status === 0) {
        alert(
          `We were unable to connect to the server. Please check your internet connection and try again.`,
        );
      } else if (error.status >= 500) {
        alert(`An unexpected problem occurred with our services. We are working on it.`);
      } else if (error.status == 401) {
        alert(`Session expired.`);
      } else if (error.status == 403) {
        alert(`You do not have permission to perform this action.`);
      } else if (error.status == 404) {
        alert(`We haven't found what you were searching.`);
      } else {
        alert(`Unknown error: ${error.message}`);
      }

      return throwError(() => error);
    }),
  );
};
