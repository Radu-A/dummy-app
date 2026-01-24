import { Injectable } from '@angular/core';

import { UserStateModel } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = 'https://dummyjson.com/auth/login';

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
      if (data.accessToken) {
        // Valid credentials
        return {
          success: true,
          data: data,
          error: null,
        };
      } else {
        // Invalid credentials
        return {
          success: false,
          data: data.message, // check invalid credentials
          error: data.message,
        };
      }
    } catch (error) {
      console.error(error);
      // Server error
      return {
        success: false,
        error: `Error in service connection: ${error}`,
      };
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
