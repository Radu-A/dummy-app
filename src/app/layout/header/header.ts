import { Component, inject } from '@angular/core';
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

  logout() {
    this.service.removeItem('dummySession');
    this.router.navigate(['/login']);
  }

  async checkSession() {
    const localStorageContent = this.service.getItem('dummySession');
    if (localStorageContent) {
      const dummySession: UserDataModel = await JSON.parse(localStorageContent);
      console.log('Hora actual', Date.now() + 10);
      console.log('Expires at: ', dummySession.expiresAt);
      if (dummySession.expiresAt <= Date.now()) {
        if (dummySession.refreshToken) {
          const response = this.service.refreshSession(dummySession);
        } else {
          this.service.removeItem('dummySession');
          this.router.navigate(['/login']);
        }
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    this.checkSession();
  }
}
