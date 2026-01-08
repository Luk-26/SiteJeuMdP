import { Component } from '@angular/core';
import { Cartemdp } from "../../elements/cartemdp/cartemdp";
import { Zoneduree } from "../../elements/zoneduree/zoneduree";
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';

interface DurationZone {
  label: string;
  items: string[];
}

@Component({
  selector: 'app-jeumdp',
  standalone: true,
  imports: [Cartemdp, Zoneduree, DragDropModule],
  templateUrl: './jeumdp.html',
  styleUrl: './jeumdp.css',
})
export class Jeumdp {
  // Liste des mots de passe à classer
  cartes: string[] = [
    '123456',
    'password',
    'admin',
    'Azerty123',
    'M0tD3P@sse',
    'SuperSecret!',
    'J@imeL3sP0mmes',
    'Ky7#9pL$2m',
    'CorrectHorseBatteryStaple'
  ];

  // Liste des zones de durée (label + items contenus)
  zones: DurationZone[] = [
    { label: 'Instant', items: [] },
    { label: '1 minute', items: [] },
    { label: '1 heure', items: [] },
    { label: '1 jour', items: [] },
    { label: '1 mois', items: [] },
    { label: '1 an', items: [] },
    { label: '10 ans', items: [] },
    { label: '100 ans', items: [] },
    { label: 'Inviolable', items: [] },
  ];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Logic for moving between lists

      // Check if target is a duration zone (not the main password list)
      const isTargetZone = event.container.data !== this.cartes;

      // If dropping into a zone and it already has an item, swap or prevent.
      // Here we will prevent having more than 1 item for cleaner UI (1:1 pair)
      if (isTargetZone && event.container.data.length >= 1) {
        // Optional: Swap logic could go here. For now, we block adding a second one.
        // Or strictly replace:
        // const existingItem = event.container.data[0];
        // event.previousContainer.data.splice(event.previousIndex, 0, existingItem);
        // event.container.data = []; 
        // transferArrayItem(...)

        // Safest simple behavior: Allow only if empty.
        return;
      }

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
