import { Component, OnInit } from '@angular/core';
import { Cartemdp } from "../../elements/cartemdp/cartemdp";
import { Zoneduree } from "../../elements/zoneduree/zoneduree";
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CSV_CONTENT } from '../../data/passwords-content';
import { HIVE_TABLE_CONTENT } from '../../data/hive-table-content';
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
  TxtDuree: string;
  duree: number
}

// --- Composant principal du jeu ---
@Component({
  selector: 'app-jeumdp',
  standalone: true,
  imports: [Cartemdp, Zoneduree, DragDropModule, CommonModule, RouterModule],
  templateUrl: './jeumdp.html',
  styleUrl: './jeumdp.css',
})
export class Jeumdp implements OnInit {

  // Injection du service Router pour la navigation.
  constructor(private router: Router) { }

  // Initialisation du composant : démarre une nouvelle partie.
  ngOnInit() {
    this.startNewLevel();
    this.parseHiveData();
  }

  // --- Utilitaires ---

  // Mélange un tableau de manière aléatoire.
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

  // Données du tableau Hive
  hiveHeaders: string[] = [];
  hiveData: string[][] = [];

  // --- Paramètres du jeu ---

  // Nombre de cartes et d'emplacements à générer pour une partie et de la difficulté
  difficulty: 'veryeasy' | 'easy' | 'medium' | 'hard' | 'veryhard' = 'medium';
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

      // Extraction des colonnes utiles : Password (index 1), texte Durée (index 4) et Durée (index 6).
      if (parts.length >= 7) {
        const pwd = parts[1];
        const TxtDuree = parts[4];
        const duree = parts[6];
        if (pwd && TxtDuree && duree) {
          parsedData.push({ pwd, TxtDuree, duree: Number(duree) });
        }
      }
    }

    // 2. Sélection des mots de passe.
    // Regroupement par durée pour assurer une distribution variée.
    const durationMap = new Map<string, string[]>();
    this.durationValues.clear(); // Reset map

    parsedData.forEach(item => {
      if (!durationMap.has(item.TxtDuree)) {
        durationMap.set(item.TxtDuree, []);
        this.durationValues.set(item.TxtDuree, item.duree);
      }
      durationMap.get(item.TxtDuree)?.push(item.pwd);
    });

    const uniqueDurations = Array.from(durationMap.keys());

    if (uniqueDurations.length < this.GAME_SIZE) {
      console.warn('Attention : Pas assez de durées uniques dans le CSV pour remplir le plateau.');
    }

    // Sélection aléatoire de cartes (selon GAME_SIZE).
    this.shuffle(uniqueDurations);
    const selectedDurations = uniqueDurations.slice(0, this.GAME_SIZE);

    // Tri des durées pour l'affichage (ordre croissant).
    selectedDurations.sort((a, b) => {
      return (this.durationValues.get(a) || 0) - (this.durationValues.get(b) || 0);
    });

    // 3. Initialisation du plateau.
    this.solutions = {};
    this.cartes = [];
    this.zones = [];

    selectedDurations.forEach(TxtDuree => {
      const candidates = durationMap.get(TxtDuree)!;
      // Choix d'un mot de passe aléatoire pour cette durée.
      const randomPwd = candidates[Math.floor(Math.random() * candidates.length)];

      this.solutions[randomPwd] = TxtDuree;
      this.cartes.push(randomPwd);
      this.zones.push({ label: TxtDuree, items: [] });
    });

    // 4. Finalisation : mélange des cartes pour le joueur.
    this.shuffle(this.cartes);
  }

  // Stocke les valeurs numériques des durées pour le tri (ex: "3 jours" -> 259200)
  private durationValues = new Map<string, number>();

  // Retourne les solutions triées par durée croissante pour l'affichage de victoire
  get sortedSolutions() {
    return Object.entries(this.solutions)
      .map(([pwd, duration]) => ({ pwd, duration }))
      .sort((a, b) => {
        const valA = this.durationValues.get(a.duration) || 0;
        const valB = this.durationValues.get(b.duration) || 0;
        return valA - valB;
      });
  }

  // Gestion de la difficulté :
  setDifficulty(difficulty: string) {
    this.difficulty = difficulty as 'veryeasy' | 'easy' | 'medium' | 'hard' | 'veryhard';

    switch (this.difficulty) {
      case 'veryeasy':
        this.GAME_SIZE = 3;
        break;
      case 'easy':
        this.GAME_SIZE = 6;
        break;
      case 'medium':
        this.GAME_SIZE = 9;
        break;
      case 'hard':
        this.GAME_SIZE = 12;
        break;
      case 'veryhard':
        this.GAME_SIZE = 15;
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
      this.generateTips();
      this.currentPopup = 'DEFEAT';
    }
  }

  // --- Gestion des conseils ---
  displayedTips: string[] = [];

  readonly TIPS_LIST = [
    "Compte les caractères ! Moins de 8 caractères ? C'est souvent 'Instantané' ou très rapide à trouver.",
    "Regarde la complexité : Des chiffres seuls (même longs) sont beaucoup plus faibles qu'un mélange avec des lettres.",
    "Repère les caractères spéciaux (@, #, !) : Dès qu'il y en a, la durée de craquage explose (souvent des siècles !).",
    "Les majuscules comptent : Un mot de passe mélangé (Majuscules/Minuscules) est bien plus résistant.",
    "Méfie-toi des classiques : '123456', 'password' ou 'azerty' sont quasiment toujours 'Instantanés'.",
    "Longueur vs Complexité : Un mot de passe très long (+12 caractères) est souvent extrêmement long à craquer, même s'il est simple.",
    "Utilise le tableau d'aide en bas de page : Il te donne les réponses selon le nombre de caractères et leur type.",
    "Compare les cartes : Si deux mots de passe ont la même longueur, celui avec le plus de symboles bizarres gagne !"
  ];

  generateTips() {
    // Sélectionne 2 conseils aléatoires pour ne pas surcharger
    const shuffled = [...this.TIPS_LIST].sort(() => 0.5 - Math.random());
    this.displayedTips = shuffled.slice(0, 2);
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

  // --- Gestion du tableau Hive ---

  parseHiveData() {
    const rows = HIVE_TABLE_CONTENT.trim().split('\n');
    if (rows.length > 0) {
      // Parse headers (first row) specifically handling quotes
      this.hiveHeaders = this.parseCsvLine(rows[0]);

      // Parse data rows
      for (let i = 1; i < rows.length; i++) {
        this.hiveData.push(this.parseCsvLine(rows[i]));
      }
    }
  }

  // Helper pour parser une ligne CSV en gérant les guillemets
  parseCsvLine(line: string): string[] {
    const parts: string[] = [];
    let current = '';
    let inQuote = false;

    for (let char of line) {
      if (char === '"') {
        inQuote = !inQuote;
      } else if (char === ',' && !inQuote) {
        parts.push(current.trim()); // Trim to remove potential spaces around comparison
        current = '';
      } else {
        current += char;
      }
    }
    parts.push(current.trim());
    return parts;
  }

  getDurationClass(duration: string): string {
    if (!duration) return '';
    const d = duration.toLowerCase();

    // 1. VIOLET : Instantané
    if (d.includes('instantan')) {
      return 'duration-purple';
    }

    // 2. VERT : Extrêmement long (Milliards et plus)
    // On a retiré "million" qui passe en jaune
    if (d.includes('milliard') || d.includes('billion') || d.includes('trillion') || d.includes('billiard') || d.includes('quintillon') || d.includes('quadrillon')) {
      return 'duration-green';
    }

    // 3. JAUNE : Très long (Millions)
    if (d.includes('million')) {
      return 'duration-yellow';
    }

    // 4. ROUGE : Court terme (jusqu'à semaines)
    if (d.includes('minute') || d.includes('heure') || d.includes('jour') || d.includes('semaine')) {
      return 'duration-red';
    }

    // 5. ORANGE : Moyen terme (Mois, Années, Siècles, Millénaires)
    // Tout ce qui contient "an", "mois", "siècle" ou "mille" et qui n'a pas été traité avant.
    if (d.includes('mois') || d.includes('an') || d.includes('siècle') || d.includes('mille')) {
      return 'duration-orange';
    }

    // Par défaut
    return '';
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
