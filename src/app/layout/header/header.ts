import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-header',
  imports: [RouterLink, MatIconModule, MatButtonModule, MatToolbarModule, MatMenuModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {}
