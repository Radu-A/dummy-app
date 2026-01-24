import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';

import { UserDataModel } from '../../models/user.model';

@Component({
  selector: 'app-header',
  imports: [RouterLink, MatIconModule, MatButtonModule, MatToolbarModule, MatMenuModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  router = inject(Router);

  gnOnInit() {
    const localStorageContent = localStorage.getItem('dummySession');
    if (localStorageContent) {
      const dummySession: UserDataModel = JSON.parse(localStorageContent);
      console.log(`ngOnInit says:`);
      console.log(`Username - ${dummySession.username}`);
    } else {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    localStorage.removeItem('dummySession');
    this.router.navigate(['/login']);
  }
}
