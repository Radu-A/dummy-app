import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';

import { UserDataModel, UserStateModel } from '../../models/user.model';
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
    const userState: UserStateModel = await this.service.isLogged();
    if (userState.success && userState.data) {
      const dummySession = userState.data;
      this.userData.set(dummySession);
    } else {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    this.checkSession();
  }
}
