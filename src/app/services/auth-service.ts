import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { RefreshResponseModel, UserDataModel, UserStateModel } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loginUrl = 'https://dummyjson.com/auth/login';
  refreshUrl = 'https://dummyjson.com/auth/refresh';
  http = inject(HttpClient);
  router = inject(Router);

  userState$ = new BehaviorSubject<UserStateModel>({ success: false });

  constructor() {
    this.loadUserState();
  }

  // =====================
  // LOCAL STORAGE METHODS
  // =====================
  setItem(itemName: string, item: string) {
    try {
      localStorage.setItem(itemName, item);
    } catch (error) {
      throw `Error saving file in local storage: ${error}`;
    }
  }
  getItem(itemName: string) {
    try {
      return localStorage.getItem(itemName);
    } catch (error) {
      throw `Error loading file in local storage: ${error}`;
    }
  }
  removeItem(itemName: string) {
    try {
      localStorage.removeItem(itemName);
    } catch (error) {
      throw `Error deleting file in local storage: ${error}`;
    }
  }

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
        const expirationTimestamp = Date.now() + 300000;
        const userData: UserDataModel = { ...data, expiresAt: expirationTimestamp };
        this.userState$.next({
          success: true,
          data: userData,
        });
        this.setItem('dummySession', JSON.stringify(this.userState$.value.data));
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

  isAuthenticated(): Observable<boolean> {
    console.log(`userState$ at isAuthenticated: ${this.userState$.value.success}`);

    return this.userState$.pipe(map((data) => data.success));
  }

  async loadUserState() {
    console.log('loadUserState');

    const localStorageContent = this.getItem('dummySession');
    if (localStorageContent) {
      const dummySession: UserDataModel = await JSON.parse(localStorageContent);
      // Only checking if exists. Future steps:
      // **CHECK EXPIRATION TIME OF REFRESH TOKEN**
      if (dummySession.refreshToken) {
        this.refreshSession(dummySession).subscribe({
          next: () => {
            console.log(`dummySession at loadUserState: ${dummySession.expiresAt}`);
            console.log(`userState$ at loadUserState: ${this.userState$.value.data?.expiresAt}`);
            console.log('Refresh successfully');
          },
          error: (err) => {
            console.log('Error in refresh');
          },
        });
      }
    } else {
      this.userState$.next({
        success: false,
      });
    }
  }

  refreshSession(userData: UserDataModel) {
    // **CHECK EXPIRATION TIME OF REFRESH TOKEN**
    const body = {
      refreshToken: userData.refreshToken,
      expiresInMins: 30,
    };
    return this.http.post<RefreshResponseModel>(this.refreshUrl, body).pipe(
      tap((res) => {
        const expirationTimestamp = Date.now() + 300000;
        const freshData: UserDataModel = {
          ...userData,
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
          expiresAt: expirationTimestamp,
        };
        this.userState$.next({
          success: true,
          data: freshData,
        });
        console.log(`userData at refreshSession: ${userData}`);
        console.log(`freshData at refreshSession: ${freshData}`);
        console.log(`userState at refreshSession: ${this.userState$.value.data}`);
        this.setItem('dummySession', JSON.stringify(this.userState$.value.data));
      }),
      map((res) => {
        return true;
      }),
      catchError((err) => {
        this.removeItem('dummySession');
        return throwError(() => err);
      }),
    );
  }

  async oldRefreshSession(userData: UserDataModel) {
    // **CHECK EXPIRATION TIME OF REFRESH TOKEN**
    try {
      const response = await fetch('https://dummyjson.com/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refreshToken: userData.refreshToken, // Optional, if not provided, the server will use the cookie
          expiresInMins: 30, // optional (FOR ACCESS TOKEN), defaults to 60
        }),
        // credentials: 'include', // Include cookies (e.g., accessToken) in the request
      });
      const data: RefreshResponseModel = await response.json();
      // Short expiration for develop
      const expirationTimestamp = Date.now() + 300000;
      userData = {
        ...userData,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: expirationTimestamp,
      };
      this.setItem('dummySession', JSON.stringify(userData));
      // Refreshing went right
      return true;
    } catch (error) {
      this.removeItem('dummySession');
      console.log(`Error refreshing token: ${error}`);
      // Refreshing went wrong
      return false;
    }
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
