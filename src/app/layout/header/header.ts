import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';

import { UserDataModel } from '../../models/user.model';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, MatIconModule, MatButtonModule, MatToolbarModule, MatMenuModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  router = inject(Router);
  private readonly service = inject(AuthService);

  userData = signal<UserDataModel | undefined>(undefined);

  logout() {
    this.service.removeItem('dummySession');
    this.router.navigate(['/login']);
  }

  async checkSession() {
    let localStorageContent = this.service.getItem('dummySession');
    if (localStorageContent) {
      const dummySession: UserDataModel = await JSON.parse(localStorageContent);
      if (dummySession.expiresAt <= Date.now()) {
        if (dummySession.refreshToken) {
          this.service.refreshSession(dummySession);
          localStorageContent = this.service.getItem('dummySession');
        } else {
          this.service.removeItem('dummySession');
          this.router.navigate(['/login']);
        }
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  async getUser() {
    let localStorageContent = this.service.getItem('dummySession');
    if (localStorageContent) {
      const dummySession: UserDataModel = await JSON.parse(localStorageContent);
      this.userData.set(dummySession);
    }
  }

  ngOnInit() {
    this.checkSession();
    this.getUser();
  }
}
