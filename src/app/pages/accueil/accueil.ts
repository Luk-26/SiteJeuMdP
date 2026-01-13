import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// --- Composant Page d'Accueil ---
// Page de présentation principale du site.
@Component({
  selector: 'app-accueil',
  imports: [RouterLink],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css',
})
export class Accueil {
  // Pas de logique ts particulière, tout est géré via le template HTML.
}
