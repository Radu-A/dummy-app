import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { errorInterceptor } from './others/interceptors/error-interceptor';

import { routes } from './app.routes';

import { AppInitService } from './services/app-init-service';

// function initConfig(initData: AppInitService) {
//   return async () => await initData.init();
// }

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorInterceptor])),
    // Execute functions at the very beggining of the app
    provideAppInitializer(() => {
      // const initializerFn = initConfig(inject(AppInitService));
      // return initializerFn();
      const service = inject(AppInitService);
      return service.init();
    }),
  ],
};
