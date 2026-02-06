import { HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { switchMap, tap, timer } from 'rxjs';
import { LoadingService } from '../../services/loading-service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Loading');
  const loadingService = inject(LoadingService);
  loadingService.setLoading(true);
  return timer(850).pipe(
    // Switch to request flow
    switchMap(() => {
      return next(req).pipe(
        // Extract info before continue the flow
        tap((event) => {
          loadingService.setLoading(false);

          if (event.type === HttpEventType.Response && event.status === 200) console.log('Loaded');
        }),
        // catchError((error) => {
        //   console.log(error);
        //   alert(error.message);
        //   return throwError(() => error);
        // }),
      );
    }),
  );
};
