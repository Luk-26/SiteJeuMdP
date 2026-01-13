import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

// Configuration principale de l'application Angular.
export const appConfig: ApplicationConfig = {
  providers: [
    // Gestionnaire d'erreurs global
    provideBrowserGlobalErrorListeners(),
    // Intégration du système de routage
    provideRouter(routes),
    // Activation de l'hydratation client pour le rendu côté serveur (SSR)
    provideClientHydration(withEventReplay())
  ]
};
