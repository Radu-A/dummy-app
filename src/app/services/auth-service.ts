import { Injectable } from '@angular/core';

import { RefreshResponseModel, UserDataModel, UserStateModel } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = 'https://dummyjson.com/auth/login';

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
      throw `Error loading file in local storage: ${error}`;
    }
  }

  async login(username: string, password: string): Promise<UserStateModel> {
    const body = JSON.stringify({
      username: username,
      password: password,
      expiresInMins: 30, // optional, defaults to 60
    });
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
      });
      const data = await response.json();
      const expirationTimestamp = Date.now() + 3000;
      // const expirationTimestamp = Date.now() + 1800000;
      const userData: UserDataModel = { ...data, expiresAt: expirationTimestamp };
      if (userData.accessToken) {
        // CASE 1 - Valid credentials
        return {
          success: true,
          data: userData,
          error: null,
        };
      } else {
        // CASE 2 - Invalid credentials
        return {
          success: false,
          data: data.message, // check invalid credentials
          error: data.message,
        };
      }
    } catch (error) {
      console.error(error);
      // CASE 3 - Server error
      return {
        success: false,
        error: `Error in service connection: ${error}`,
      };
    }
  }

  async refreshSession(userData: UserDataModel) {
    console.log('Refresh Token');

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
      userData = { ...userData, accessToken: data.accessToken, refreshToken: data.refreshToken };
      this.setItem('dummySession', JSON.stringify(userData));
    } catch (error) {
      console.log(`Error refreshing token: ${error}`);
      throw `Error refreshing token: ${error}`;
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
