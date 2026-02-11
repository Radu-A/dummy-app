import { Component, inject, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-not-found-page',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    RouterLink,
  ],
  templateUrl: './not-found-page.html',
  styleUrl: './not-found-page.scss',
})
export class NotFoundPage {
  route = inject(ActivatedRoute);
  message = signal<string>("We couldn't find that page!");
  defaultSub = 'Check that you tiped the proper direction or come back to home.';

  ngOnInit() {
    const errorType = this.route.snapshot.queryParamMap.get('type');
    if (errorType === 'api') this.message.set("We couldn't find what you were searching");
  }
}
