import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';

import { UserDataModel } from '../../models/user.model';
import { StorageService } from '../../services/storage-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, MatIconModule, MatButtonModule, MatToolbarModule, MatMenuModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  router = inject(Router);

  private readonly storageService = inject(StorageService);

  userData = signal<UserDataModel | undefined>(undefined);

  logout() {
    this.storageService.removeItem('dummySession');
    this.router.navigate(['/login']);
  }
}
