import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { tokenHandlerInterceptor } from './core/interceptors/token-handler-interceptor';
import { loaderHandlerInterceptor } from './core/interceptors/loader-handler-interceptor';
import { errorHandlerInterceptor } from './core/interceptors/error-handler-interceptor';
// !! http
import {provideTranslateService} from "@ngx-translate/core";
import {provideTranslateHttpLoader} from "@ngx-translate/http-loader";


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch() , withInterceptors([tokenHandlerInterceptor , loaderHandlerInterceptor , errorHandlerInterceptor])),
    provideAnimations(),
    provideToastr(),
     provideTranslateService({
      // ./ ar.json en.json
       loader: provideTranslateHttpLoader({
        prefix: '/i18n/',
        suffix: '.json'
      }),

   
     })
  ]
};
