import { Component, OnInit } from '@angular/core';
import { Cartemdp } from "../../elements/cartemdp/cartemdp";
import { Zoneduree } from "../../elements/zoneduree/zoneduree";
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CSV_CONTENT } from '../../data/passwords-content';
import confetti from 'canvas-confetti';

interface DurationZone {
  label: string;
  items: string[];
}

type PopupType = 'RULES' | 'INCOMPLETE' | 'VICTORY' | 'DEFEAT' | 'NONE';

interface ParsedPwd {
  pwd: string;
  dur: string;
}

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

  // Gestion de l'état des popups
  currentPopup: PopupType = 'RULES';

  // Gestion des données du jeu
  solutions: Record<string, string> = {};
  cartes: string[] = [];

  // Liste des zones de durée (Générée dynamiquement)
  zones: DurationZone[] = [];

  startNewLevel() {
    // 1. Analyser le CSV
    const rows = CSV_CONTENT.trim().split('\n');
    const parsedData: ParsedPwd[] = [];

    // Commencer à l'index 1 pour sauter l'en-tête
    for (let i = 1; i < rows.length; i++) {
      // Approche de découpage manuel pour gérer la séparation par virgule simple
      // Note : Cela correspond à la structure CSV simplifiée que nous contrôlons
      const parts: string[] = [];
      let current = '';
      let inQuote = false;
      const row = rows[i];

      for (let char of row) {
        if (char === '"') {
          inQuote = !inQuote;
        } else if (char === ',' && !inQuote) {
          parts.push(current);
          current = '';
        } else {
          current += char;
        }
      }
      parts.push(current);

      if (parts.length >= 6) {
        // ID, Mot de passe, Longueur, Catégorie, Temps, Niveau
        // Le mot de passe est à l'index 1, la durée à l'index 4
        const pwd = parts[1];
        const dur = parts[4];
        if (pwd && dur) {
          parsedData.push({ pwd, dur });
        }
      }
    }

    // 2. Sélectionner 9 durées uniques pour assurer la variété
    // Grouper les mots de passe par durée
    const durationMap = new Map<string, string[]>();
    parsedData.forEach(item => {
      if (!durationMap.has(item.dur)) {
        durationMap.set(item.dur, []);
      }
      durationMap.get(item.dur)?.push(item.pwd);
    });

    // Obtenir toutes les durées uniques
    const uniqueDurations = Array.from(durationMap.keys());

    // S'assurer d'avoir assez de durées uniques (repli sinon)
    if (uniqueDurations.length < 9) {
      console.warn('Not enough unique durations found in CSV for guaranteed uniqueness.');
    }

    // Mélanger et en choisir 9
    this.shuffle(uniqueDurations);
    const selectedDurations = uniqueDurations.slice(0, 9);

    // 3. Construire l'état du jeu avec un mot de passe par durée sélectionnée
    this.solutions = {};
    this.cartes = [];
    this.zones = [];

    selectedDurations.forEach(dur => {
      const candidates = durationMap.get(dur)!;
      // Choisir un mot de passe aléatoire pour cette durée
      const randomPwd = candidates[Math.floor(Math.random() * candidates.length)];

      this.solutions[randomPwd] = dur;
      this.cartes.push(randomPwd);
      this.zones.push({ label: dur, items: [] });
    });

    // 4. Randomiser l'ordre visuel
    this.shuffle(this.cartes); // Mélanger les cartes dans la banque
    this.shuffle(this.zones);  // Mélanger les zones sur le plateau
  }

  closePopup() {
    this.currentPopup = 'NONE';
  }

  btnValider() {
    // 1. Vérifier si toutes les cartes sont placées (la liste source 'cartes' doit être vide)
    if (this.cartes.length > 0) {
      this.currentPopup = 'INCOMPLETE';
      return;
    }

    // 2. Valider les paires
    let allCorrect = true;
    const incorrectCards: string[] = [];

    // Parcourir toutes les zones pour vérifier
    this.zones.forEach(zone => {
      if (zone.items.length > 0) {
        const cardValue = zone.items[0];
        const correctDuration = this.solutions[cardValue];

        if (correctDuration !== zone.label) {
          // Mauvais placement
          allCorrect = false;
          incorrectCards.push(cardValue);
          zone.items = []; // Retirer de la zone
        } else {
          // Bon placement : on laisse la carte en place
        }
      }
    });

    if (allCorrect) {
      this.currentPopup = 'VICTORY';
      this.triggerConfetti();
    } else {
      // Renvoyer les cartes incorrectes dans la zone de départ
      this.cartes.push(...incorrectCards);
      this.currentPopup = 'DEFEAT';
    }
  }

  triggerConfetti() {
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
      // lancer quelques confettis depuis le bord gauche
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#507693', '#A8BDCE', '#FFFFFF'] // Couleurs du site
      });
      // et en lancer quelques-uns depuis le bord droit
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#507693', '#A8BDCE', '#FFFFFF']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }

  // Actions
  resetGame() {
    this.startNewLevel();
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

      // Limiter à 1 élément par zone
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
