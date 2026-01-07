import { Component } from '@angular/core';
import { Cartemdp } from "../../elements/cartemdp/cartemdp";
import { Zoneduree } from "../../elements/zoneduree/zoneduree";

@Component({
  selector: 'app-jeumdp',
  imports: [Cartemdp, Zoneduree],
  templateUrl: './jeumdp.html',
  styleUrl: './jeumdp.css',
})
export class Jeumdp {
  // Création de listes temporaires pour générer les éléments
  cartes = Array(9).fill(0);
  zones = Array(9).fill(0);
}
