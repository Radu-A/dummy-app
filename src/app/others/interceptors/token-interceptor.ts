import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { environment } from '../../../environments/environment.development';

import { AuthService } from '../../services/auth-service';
import { BehaviorSubject } from 'rxjs';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // To save access token in a reactive way
  const accessToken$ = new BehaviorSubject<string | undefined>(undefined);

  // Subscribe and save access token in Behaviour Subject
  authService.getSessionData().subscribe((data) => accessToken$.next(data?.accessToken));

  if (req.url.startsWith(`${environment.apiUrl}/auth/products/`)) {
    const newReq = req.clone({
      headers: req.headers.append('Authorization', `Bearer ${accessToken$.value}`),
    });
    // HttpClient append 'Content-Type' headers for you
    // newReq.headers.set('Content-Type', 'application/json');

    // Check that token change every 5 seconds
    // console.log(`Token interceptor - injecting token in headers requests: ${accessToken$.value}`);

    return next(newReq);
  }
  return next(req);
};
