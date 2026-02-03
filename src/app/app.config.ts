import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { AppInitService } from './services/app-init-service';

// function initConfig(initData: AppInitService) {
//   return async () => await initData.init();
// }

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // Execute functions at the very beggining of the app
    provideAppInitializer(() => {
      // const initializerFn = initConfig(inject(AppInitService));
      // return initializerFn();
      const service = inject(AppInitService);
      return service.init();
    }),
  ],
};
