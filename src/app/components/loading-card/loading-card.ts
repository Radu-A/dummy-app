import { Component } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-card',
  imports: [MatCardModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './loading-card.html',
  styleUrl: './loading-card.scss',
})
export class LoadingCard {}
