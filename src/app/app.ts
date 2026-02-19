import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { LoadingService } from './services/loading-service';
import { ErrorService } from './services/error-service';
import { BreakpointService } from './services/breakpoint-service';

import { MessageModal } from './components/message-modal/message-modal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly loadingService = inject(LoadingService);
  private readonly errorService = inject(ErrorService);
  private readonly breakpointService = inject(BreakpointService);
  private dialog = inject(MatDialog);

  screenSize = this.breakpointService.screenSize;

  constructor() {
    this.breakpointService.observe();

    // "effect" react to signal changes and execute his snippet
    effect(() => {
      const isLoading = this.loadingService.isLoading();
      if (isLoading) {
        this.dialog.open(MessageModal, {
          data: { message: 'Loading content...' },
        });
      } else {
        this.dialog.closeAll();
      }
    });
    effect(() => {
      const isError = this.errorService.isError();
      const errorMessage = this.errorService.errorMessage();
      if (isError) {
        this.dialog.open(MessageModal, {
          data: { message: errorMessage },
        });
      } else {
        this.dialog.closeAll();
      }
    });
  }
}
