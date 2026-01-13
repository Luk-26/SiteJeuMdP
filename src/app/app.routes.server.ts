import { RenderMode, ServerRoute } from '@angular/ssr';

// Configuration des routes pour le rendu côté serveur (SSR).
// Définit comment chaque route doit être rendue (ex: Prerender, Server, Client).
export const serverRoutes: ServerRoute[] = [
  {
    path: '**', // Pour toutes les routes
    renderMode: RenderMode.Prerender // Prerendering (génération statique) par défaut
  }
];
