import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-zoneduree',
  imports: [],
  templateUrl: './zoneduree.html',
  styleUrl: './zoneduree.css',
})
export class Zoneduree {
  @Input() duree: string = '';
}
