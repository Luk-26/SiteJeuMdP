import { Component, OnInit } from '@angular/core';
import { Cartemdp } from "../../elements/cartemdp/cartemdp";
import { Zoneduree } from "../../elements/zoneduree/zoneduree";
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DATASETS } from '../../data/donnees-mdp';

interface DurationZone {
  label: string;
  items: string[];
}

type PopupType = 'RULES' | 'INCOMPLETE' | 'VICTORY' | 'DEFEAT' | 'NONE';

@Component({
  selector: 'app-jeumdp',
  standalone: true,
  imports: [Cartemdp, Zoneduree, DragDropModule, CommonModule],
  templateUrl: './jeumdp.html',
  styleUrl: './jeumdp.css',
})
export class Jeumdp implements OnInit {
  constructor(private router: Router) { }

  ngOnInit() {
    this.startNewLevel();
  }

  shuffle(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // State Management for Popups
  currentPopup: PopupType = 'RULES';

  // Game Data Management
  solutions: Record<string, string> = {};
  cartes: string[] = [];

  // Data Sets (Paires Mot de passe / Durée) importing from separate file
  datasets = DATASETS;

  startNewLevel() {
    // 1. Clear current state of zones
    this.zones.forEach(z => z.items = []);

    // 2. Pick a random dataset
    const randomIndex = Math.floor(Math.random() * this.datasets.length);
    const selectedSet = this.datasets[randomIndex];

    // 3. Build solutions and cards
    this.solutions = {};
    this.cartes = [];

    selectedSet.forEach(item => {
      this.solutions[item.pwd] = item.dur;
      this.cartes.push(item.pwd);
    });

    // 4. Randomize visual order
    this.shuffle(this.cartes);
    this.shuffle(this.zones);
  }

  // Liste des zones de durée
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

  closePopup() {
    this.currentPopup = 'NONE';
  }

  btnValider() {
    // 1. Check if all cards are placed (source list 'cartes' must be empty)
    if (this.cartes.length > 0) {
      this.currentPopup = 'INCOMPLETE';
      return;
    }

    // 2. Validate Pairs
    let isWin = true;
    for (const zone of this.zones) {
      if (zone.items.length === 0) continue; // Should not happen if cartes is empty and 1:1 mapping

      const cardValue = zone.items[0];
      const correctDuration = this.solutions[cardValue];

      if (correctDuration !== zone.label) {
        isWin = false;
        break; // Stop at first error
      }
    }

    if (isWin) {
      this.currentPopup = 'VICTORY';
    } else {
      this.currentPopup = 'DEFEAT';
    }
  }

  // Actions
  resetGame() {
    this.startNewLevel();
    this.closePopup();
  }

  resetPlacement() {
    // Collect all items from zones back to cartes
    this.zones.forEach(zone => {
      this.cartes.push(...zone.items);
      zone.items = [];
    });
    this.closePopup();
  }

  goToTools() {
    this.router.navigate(['/boite-a-outils']);
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const isTargetZone = event.container.data !== this.cartes;

      // Limit to 1 item per zone
      if (isTargetZone && event.container.data.length >= 1) {
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
