import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cartemdp',
  imports: [],
  templateUrl: './cartemdp.html',
  styleUrl: './cartemdp.css',
})
export class Cartemdp {
  @Input() texte: string = '';
}
