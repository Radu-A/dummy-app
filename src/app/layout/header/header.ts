import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';

import { UserDataModel } from '../../models/user.model';
import { StorageService } from '../../services/storage-service';
import { AuthService } from '../../services/auth-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [RouterLink, MatIconModule, MatButtonModule, MatToolbarModule, MatMenuModule, AsyncPipe],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  router = inject(Router);

  private readonly storageService = inject(StorageService);
  private readonly authService = inject(AuthService);

  userData$ = new Observable<UserDataModel | undefined>(undefined);

  logout() {
    this.storageService.removeItem('dummySession');
    this.storageService.removeItem('dummyParams');
    this.router.navigate(['/login']);
  }

  constructor() {
    this.userData$ = this.authService.getSessionData();
  }
}
