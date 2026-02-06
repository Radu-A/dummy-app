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
        this.storageService.setItem('dummySession', JSON.stringify(this.sessionData$.value.data));
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

  isAuthenticated(): Observable<boolean | undefined> {
    // Return only true/false to auth-guard
    return this.sessionData$.pipe(map((data) => data.success));
  }

  getSessionData(): Observable<UserDataModel | undefined> {
    return this.sessionData$.pipe(map((session) => session.data));
  }

  loadUserState() {
    const localStorageContent = this.storageService.getItem('dummySession');

    // CASE 1 - Nothing in local storage
    // no access token + no refresh token
    if (!localStorageContent)
      return this.sessionData$.next({
        success: false,
      });
    const dummySession: UserDataModel = JSON.parse(localStorageContent);

    // CASE 2 - Session active (happy path!)
    if (dummySession.expiresAt > Date.now()) {
      this.sessionData$.next({
        success: true,
        data: dummySession,
      });
      this.storageService.setItem('dummySession', JSON.stringify(this.sessionData$.value.data));
      // CASE 3 - Lapsed access token
    } else {
      // **NOT CHECKING EXPIRATION TIME OF REFRESH TOKEN**
      if (dummySession.refreshToken) {
        this.refreshSession(dummySession).subscribe({
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
        console.log('There is not refresh token.');
      }
    }
  }

  refreshSession(userData: UserDataModel) {
    // **NOT CHECKING EXPIRATION TIME OF REFRESH TOKEN**
    const body = {
      refreshToken: userData.refreshToken, // Optional, if not provided, the server will use the cookie
      expiresInMins: 30, // optional (FOR ACCESS TOKEN), defaults to 60
    };
    return this.http.post<RefreshResponseModel>(this.refreshUrl, body).pipe(
      // CASE 1 - Refreshing went right
      tap((res) => {
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
        this.storageService.setItem('dummySession', JSON.stringify(this.sessionData$.value.data));
      }),
      map((res) => {
        return true;
      }),
      // CASE 2 - Refreshing went wrong
      catchError((error) => {
        this.storageService.removeItem('dummySession');
        this.sessionData$.next({
          success: false,
          error: error,
        });
        console.error('Refresh Token Error:', error);
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
