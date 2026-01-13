import { Component, Input } from '@angular/core';

// --- Composant Carte Mot de Passe ---
// Représente visuellement un mot de passe sous forme de carte déplaçable.
@Component({
  selector: 'app-cartemdp',
  standalone: true,
  imports: [],
  templateUrl: './cartemdp.html',
  styleUrl: './cartemdp.css',
})
export class Cartemdp {
  // Le texte du mot de passe à afficher.
  @Input() texte: string = '';
}
