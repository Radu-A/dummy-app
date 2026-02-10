import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment.development';

import { UserDataModel } from '../models/user.model';
import { SessionModel, RefreshResponseModel } from '../models/auth.model';

import { StorageService } from './storage-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loginUrl = `${environment.apiUrl}/auth/login`;
  refreshUrl = `${environment.apiUrl}/auth/refresh`;

  http = inject(HttpClient);
  router = inject(Router);

  storageService = inject(StorageService);

  // Initialize as undefined cause we need one state more:
  // auth-guard call "isAuthenticated()" before
  // before constructor call "loadUserState()"
  sessionData$ = new BehaviorSubject<SessionModel>({ success: undefined });

  // ==================
  // REACTIVE METHODS
  // ==================
  login(username: string, password: string) {
    const body = {
      username: username,
      password: password,
      expiresInMins: 30, // optional, defaults to 60
    };
    return this.http.post<UserDataModel>(this.loginUrl, body).pipe(
      // CASE 1 - Valid credentials
      tap((data) => {
        console.log(`CASE 1`);
        // 30 min = 1800000 ms
        const expirationTimestamp = Date.now() + 5000; // only 5 seconds to test interceptor
        const userData: UserDataModel = { ...data, expiresAt: expirationTimestamp };
        this.sessionData$.next({
          success: true,
          data: userData,
        });
        this.storageService.setItem('dummySession', this.sessionData$.value.data);
      }),
      // CASE 2 - Error
      // catchError((err) => {
      //   console.log(`CASE 2`);

      //   this.userState.next({
      //     success: false,
      //     error: err.error.message,
      //   });
      //   this.removeItem('dummySession');
      //   return throwError(() => err);
      // }),
    );
  }

  logout() {
    this.storageService.removeItem('dummySession');
    this.sessionData$.next({
      success: false,
      data: undefined,
    });
    this.router.navigate(['/login']);
  }

  isAuthenticated(): Observable<boolean | undefined> {
    // Return only true/false to auth-guard
    return this.sessionData$.pipe(map((data) => data.success));
  }

  getSessionData(): Observable<UserDataModel | undefined> {
    return this.sessionData$.pipe(map((session) => session.data));
  }

  loadUserState() {
    const dummySession: UserDataModel = this.storageService.getItem('dummySession');

    // CASE 1 - Nothing in local storage
    // no access token + no refresh token
    // *** logout??? ***
    if (!dummySession) {
      console.log('CASE 1 - Nothing in local storage');

      return this.sessionData$.next({
        success: false,
      });
    }

    // CASE 2 - Session active (happy path!)
    if (dummySession.expiresAt > Date.now()) {
      console.log('CASE 2 - Session active (happy path!)');

      this.sessionData$.next({
        success: true,
        data: dummySession,
      });
      // CASE 3 - Lapsed access token
    } else {
      console.log('CASE 3 - Lapsed access token');

      this.sessionData$.next({
        success: true,
        data: dummySession,
      });
      // **NOT CHECKING EXPIRATION TIME OF REFRESH TOKEN**
      if (dummySession.refreshToken) {
        this.refreshSession().subscribe({
          // CASE 1 - Refreshing went right
          next: () => {
            console.log('Refresh successfully.');
          },
          // CASE 2 - Refreshing went wrong
          error: (error) => {
            console.log('Load User State Error:', error);
          },
        });
        // CASE 3 - No refresh token
      } else {
        // *** logout???***
        console.log('No refresh token available');
      }
    }
  }

  refreshSession() {
    const userData = this.sessionData$.value.data;

    if (!userData?.refreshToken) {
      console.log('No refresh token available');
      return throwError(() => Error('No refresh token available'));
    }

    // **NOT CHECKING EXPIRATION TIME OF REFRESH TOKEN**
    const body = {
      refreshToken: userData.refreshToken, // Optional, if not provided, the server will use the cookie
      expiresInMins: 30, // optional (FOR ACCESS TOKEN), defaults to 60
    };

    return this.http.post<RefreshResponseModel>(this.refreshUrl, body).pipe(
      // CASE 1 - Refreshing went right
      tap((res) => {
        console.log('CASE 1 - Refreshing went right (refreshSession)');
        // 30 min = 1800000 ms
        const expirationTimestamp = Date.now() + 5000; // only 5 seconds to test interceptor
        const freshData: UserDataModel = {
          ...userData,
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
          expiresAt: expirationTimestamp,
        };
        this.sessionData$.next({
          success: true,
          data: freshData,
        });
        this.storageService.setItem('dummySession', this.sessionData$.value.data);
      }),
      // CASE 2 - Refreshing went wrong
      catchError((error) => {
        console.log('CASE 2 - Refreshing went wrong (refreshSession)');
        console.error('Refresh Token Error:', error);
        // Cunrrently calling to logout from error-interceptor
        // Improve: implement critic errors
        //   this.logout();
        return throwError(() => error);
      }),
    );
  }
}

// ===============
// DummyJSON docs:
// ===============
//   fetch('https://dummyjson.com/auth/login', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({

//     username: 'emilys',
//     password: 'emilyspass',
//     expiresInMins: 30, // optional, defaults to 60
//   }),
//   credentials: 'include' // Include cookies (e.g., accessToken) in the request
// })
