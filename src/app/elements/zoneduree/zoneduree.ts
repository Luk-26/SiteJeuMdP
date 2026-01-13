import { Component, Input } from '@angular/core';

// --- Composant Zone de Durée ---
// Représente une zone cible (bucket) correspondant à une durée de résistance spécifique.
@Component({
  selector: 'app-zoneduree',
  standalone: true,
  imports: [],
  templateUrl: './zoneduree.html',
  styleUrl: './zoneduree.css',
})
export class Zoneduree {
  // Le libellé de la durée (ex: "3 jours", "Instantanné").
  @Input() duree: string = '';
}
