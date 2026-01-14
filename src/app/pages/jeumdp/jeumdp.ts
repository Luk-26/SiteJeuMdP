import { Component, OnInit } from '@angular/core';
import { Cartemdp } from "../../elements/cartemdp/cartemdp";
import { Zoneduree } from "../../elements/zoneduree/zoneduree";
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CSV_CONTENT } from '../../data/passwords-content';
import confetti from 'canvas-confetti';

// --- Définitions des types (Modèles de données) ---

// Structure d'une zone de durée : un libellé et une liste de cartes.
interface DurationZone {
  label: string;
  items: string[];
}

// Types de popups disponibles dans le jeu.
type PopupType = 'RULES' | 'INCOMPLETE' | 'VICTORY' | 'DEFEAT' | 'NONE';

// Structure d'un mot de passe issu du parsing CSV.
interface ParsedPwd {
  pwd: string;
  dur: string;
}

// --- Composant principal du jeu ---
@Component({
  selector: 'app-jeumdp',
  standalone: true,
  imports: [Cartemdp, Zoneduree, DragDropModule, CommonModule],
  templateUrl: './jeumdp.html',
  styleUrl: './jeumdp.css',
})
export class Jeumdp implements OnInit {

  // Injection du service Router pour la navigation.
  constructor(private router: Router) { }

  // Initialisation du composant : démarre une nouvelle partie.
  ngOnInit() {
    this.startNewLevel();
  }

  // --- Utilitaires ---

  // Mélange un tableau de manière aléatoire (Algorithme de Fisher-Yates).
  shuffle(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // --- État du jeu ---

  // État actuel de l'affichage des popups (par défaut : Règles).
  currentPopup: PopupType = 'RULES';

  // Dictionnaire de solutions : Mot de passe -> Durée correcte.
  solutions: Record<string, string> = {};

  // Cartes disponibles dans la pioche (source).
  cartes: string[] = [];

  // Zones de durée où les cartes doivent être déposées (cibles).
  zones: DurationZone[] = [];

  // --- Paramètres du jeu ---

  // Nombre de cartes et d'emplacements à générer pour une partie et de la difficulté
  difficulty: 'easy' | 'medium' | 'hard' = 'medium';
  GAME_SIZE = 9;

  // --- Logique du jeu ---

  // Prépare et lance un nouveau niveau.
  startNewLevel() {
    // 1. Parsing du fichier CSV injecté via CSV_CONTENT.
    const rows = CSV_CONTENT.trim().split('\n');
    const parsedData: ParsedPwd[] = [];

    // Parcours des lignes (skip header).
    for (let i = 1; i < rows.length; i++) {
      // Analyse manuelle du CSV pour gérer les cas avec guillemets.
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
      parts.push(current); // Ajout du dernier champ

      // Extraction des colonnes utiles : Password (index 1) et Durée (index 4).
      if (parts.length >= 6) {
        const pwd = parts[1];
        const dur = parts[4];
        if (pwd && dur) {
          parsedData.push({ pwd, dur });
        }
      }
    }

    // 2. Sélection des mots de passe.
    // Regroupement par durée pour assurer une distribution variée.
    const durationMap = new Map<string, string[]>();
    parsedData.forEach(item => {
      if (!durationMap.has(item.dur)) {
        durationMap.set(item.dur, []);
      }
      durationMap.get(item.dur)?.push(item.pwd);
    });

    const uniqueDurations = Array.from(durationMap.keys());

    if (uniqueDurations.length < this.GAME_SIZE) {
      console.warn('Attention : Pas assez de durées uniques dans le CSV pour remplir le plateau.');
    }

    // Sélection aléatoire de cartes (selon GAME_SIZE).
    this.shuffle(uniqueDurations);
    const selectedDurations = uniqueDurations.slice(0, this.GAME_SIZE);

    // 3. Initialisation du plateau.
    this.solutions = {};
    this.cartes = [];
    this.zones = [];

    selectedDurations.forEach(dur => {
      const candidates = durationMap.get(dur)!;
      // Choix d'un mot de passe aléatoire pour cette durée.
      const randomPwd = candidates[Math.floor(Math.random() * candidates.length)];

      this.solutions[randomPwd] = dur;
      this.cartes.push(randomPwd);
      this.zones.push({ label: dur, items: [] });
    });

    // 4. Finalisation : mélange des cartes et des zones pour le joueur.
    this.shuffle(this.cartes);
    this.shuffle(this.zones);
  }

  // Gestion de la difficulté :
  setDifficulty(difficulty: string) {
    this.difficulty = difficulty as 'easy' | 'medium' | 'hard';

    switch (this.difficulty) {
      case 'easy':
        this.GAME_SIZE = 6;
        break;
      case 'medium':
        this.GAME_SIZE = 9;
        break;
      case 'hard':
        this.GAME_SIZE = 12;
        break;
    }

    this.startNewLevel();
  }

  // --- Gestion de l'interface ---

  closePopup() {
    this.currentPopup = 'NONE';
  }

  // Vérifie les réponses du joueur et détermine la victoire ou la défaite.
  btnValider() {
    // Vérification : toutes les cartes doivent être placées.
    if (this.cartes.length > 0) {
      this.currentPopup = 'INCOMPLETE';
      return;
    }

    let allCorrect = true;
    const incorrectCards: string[] = [];

    // Vérification zone par zone.
    this.zones.forEach(zone => {
      if (zone.items.length > 0) {
        const cardValue = zone.items[0];
        const correctDuration = this.solutions[cardValue];

        // Si la durée ne correspond pas, c'est une erreur.
        if (correctDuration !== zone.label) {
          allCorrect = false;
          incorrectCards.push(cardValue);
          zone.items = []; // On vide la zone incorrecte.
        }
      }
    });

    if (allCorrect) {
      this.currentPopup = 'VICTORY';
      this.triggerConfetti();
    } else {
      // En cas d'erreur, les cartes incorrectes retournent dans la pioche.
      this.cartes.push(...incorrectCards);
      this.currentPopup = 'DEFEAT';
    }
  }

  // Déclenche l'animation de confettis (bibliothèque canvas-confetti).
  triggerConfetti() {
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
      // Confettis depuis la gauche
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#507693', '#A8BDCE', '#FFFFFF']
      });
      // Confettis depuis la droite
      confetti({
        particleCount: 5,
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

  // --- Actions utilisateur ---

  resetGame() {
    this.startNewLevel();
    this.closePopup();
  }

  goToTools() {
    this.router.navigate(['/boite-a-outils']);
  }

  // --- Gestion du Drag & Drop ---

  // Gère le dépôt d'une carte dans une zone (pioche ou zone de réponse).
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      // Réorganisation dans la même liste.
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Déplacement d'une liste à l'autre.

      const isTargetZone = event.container.data !== this.cartes;

      // Contrainte : Une zone de réponse ne peut contenir qu'une seule carte.
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
