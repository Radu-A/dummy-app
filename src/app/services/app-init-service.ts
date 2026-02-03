import { inject, Injectable } from '@angular/core';

import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class AppInitService {
  authService = inject(AuthService);
  public init() {
    // Get user data from localStorage
    this.authService.loadUserState();
  }
}
