import { Component } from '@angular/core';
import { Generateurmdp } from "../../elements/generateurmdp/generateurmdp";
import { Testeurmdp } from "../../elements/testeurmdp/testeurmdp";

// --- Composant Boîte à Outils ---
// Conteneur regroupant les outils de sécurité (Générateur et Testeur).
@Component({
  selector: 'app-outils',
  imports: [Generateurmdp, Testeurmdp],
  templateUrl: './outils.html',
  styleUrl: './outils.css',
})
export class Outils {
  // Ce composant agrège simplement les deux outils disponibles.
}
