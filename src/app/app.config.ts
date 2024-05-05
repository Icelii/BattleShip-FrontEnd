import { ApplicationConfig, ErrorHandler, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { tokenHandlerInterceptor } from './core/interceptors/token-handler.interceptor';
import { spinnerInterceptor } from './core/interceptors/spinner.interceptor';
import { errorHandlerInterceptor } from './core/interceptors/error-handler.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(), provideHttpClient(withFetch(), 
    withInterceptors([errorHandlerInterceptor, tokenHandlerInterceptor, spinnerInterceptor]))]
};
