import { Component, OnInit } from '@angular/core';
import { Cartemdp } from "../../elements/cartemdp/cartemdp";
import { Zoneduree } from "../../elements/zoneduree/zoneduree";
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CSV_CONTENT } from '../../data/passwords-content';
import confetti from 'canvas-confetti';

// --- Définitions des types de données (Les "moules" pour nos informations) ---

// Définit à quoi ressemble une "zone de durée" : elle a un nom (label) et contient une liste d'objets (items)
interface DurationZone {
  label: string;
  items: string[];
}

// Liste des différents types de fenêtres surgissantes (Popups) possibles dans le jeu
type PopupType = 'RULES' | 'INCOMPLETE' | 'VICTORY' | 'DEFEAT' | 'NONE';

// Définit à quoi ressemble un mot de passe lu depuis le fichier de données : le mot de passe lui-même (pwd) et sa durée de résistance (dur)
interface ParsedPwd {
  pwd: string;
  dur: string;
}

// --- Configuration du composant principal du jeu ---
@Component({
  selector: 'app-jeumdp', // Le nom utilisé pour inclure ce jeu ailleurs dans le site
  standalone: true, // Indique que ce composant est autonome et n'a pas besoin d'être déclaré dans un module global
  imports: [Cartemdp, Zoneduree, DragDropModule, CommonModule], // Liste des outils et autres composants nécessaires pour que le jeu fonctionne
  templateUrl: './jeumdp.html', // Le fichier contenant l'affichage (HTML)
  styleUrl: './jeumdp.css', // Le fichier contenant le style (couleurs, mise en page...)
})
export class Jeumdp implements OnInit {

  // Le constructeur est la première chose appelée lors du chargement. Ici, on récupère l'outil de navigation (Router) pour pouvoir changer de page.
  constructor(private router: Router) { }

  // ngOnInit est appelé juste après le chargement du composant. C'est ici qu'on lance la préparation du jeu.
  ngOnInit() {
    this.startNewLevel(); // On démarre une nouvelle partie
  }

  // --- Fonction utilitaire pour mélanger ---
  // Cette fonction prend une liste (tableau) et mélange ses éléments au hasard, comme on battrait un jeu de cartes.
  shuffle(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // --- Variables d'état du jeu (La "mémoire" du jeu) ---

  // Stocke quel popup est actuellement affiché. Au début, on affiche les règles ('RULES').
  currentPopup: PopupType = 'RULES';

  // "solutions" est un dictionnaire qui permettra de vérifier les réponses : Mot de passe -> Durée correcte
  solutions: Record<string, string> = {};

  // "cartes" est la liste des mots de passe qui sont dans la pioche (à gauche de l'écran)
  cartes: string[] = [];

  // "zones" est la liste des zones de durée (à droite de l'écran) où le joueur doit déposer les cartes
  zones: DurationZone[] = [];

  // --- Préparation d'une nouvelle partie ---
  startNewLevel() {
    // 1. Lire et comprendre le fichier de données (CSV) qui contient tous les mots de passe
    const rows = CSV_CONTENT.trim().split('\n'); // On découpe le fichier ligne par ligne
    const parsedData: ParsedPwd[] = [];

    // On parcourt chaque ligne du fichier (en sautant la première ligne qui contient les titres des colonnes)
    for (let i = 1; i < rows.length; i++) {
      // Le code ci-dessous sert à découper proprement chaque ligne pour séparer les colonnes (ID, Mot de passe, Durée, etc.)
      const parts: string[] = [];
      let current = '';
      let inQuote = false; // Gestion des guillemets pour ne pas couper au mauvais endroit
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
      parts.push(current); // Ajoute le dernier morceau de la ligne

      // Si on a bien lu toutes les informations nécessaires
      if (parts.length >= 6) {
        // On récupère le mot de passe (colonne n°2) et la durée (colonne n°5)
        const pwd = parts[1];
        const dur = parts[4];
        if (pwd && dur) {
          // On ajoute ce couple (mot de passe, durée) à notre liste de données utilisables
          parsedData.push({ pwd, dur });
        }
      }
    }

    // 2. Sélectionner les mots de passe pour cette partie
    // On regroupe d'abord les mots de passe par "durée" pour pouvoir en piocher un de chaque type
    const durationMap = new Map<string, string[]>();
    parsedData.forEach(item => {
      if (!durationMap.has(item.dur)) {
        durationMap.set(item.dur, []);
      }
      durationMap.get(item.dur)?.push(item.pwd);
    });

    // On récupère la liste de toutes les durées différentes qui existent
    const uniqueDurations = Array.from(durationMap.keys());

    // Petite vérification de sécurité pour s'assurer qu'on a assez de données
    if (uniqueDurations.length < 9) {
      console.warn('Pas assez de durées uniques trouvées dans le fichier CSV.');
    }

    // On mélange les durées et on en garde seulement 9 pour la partie
    this.shuffle(uniqueDurations);
    const selectedDurations = uniqueDurations.slice(0, 9);

    // 3. Mettre en place le plateau de jeu
    this.solutions = {}; // On remet à zéro les solutions
    this.cartes = [];    // On vide la pioche
    this.zones = [];     // On vide les zones de réponse

    // Pour chaque durée qu'on a sélectionnée...
    selectedDurations.forEach(dur => {
      const candidates = durationMap.get(dur)!;
      // ... on choisit un mot de passe au hasard qui correspond à cette durée
      const randomPwd = candidates[Math.floor(Math.random() * candidates.length)];

      // On enregistre la bonne réponse pour plus tard
      this.solutions[randomPwd] = dur;
      // On ajoute le mot de passe à la pioche
      this.cartes.push(randomPwd);
      // On crée la zone de dépôt correspondante sur le plateau
      this.zones.push({ label: dur, items: [] });
    });

    // 4. Mélanger pour ne pas rendre le jeu trop facile
    this.shuffle(this.cartes); // On mélange les cartes dans la pioche
    this.shuffle(this.zones);  // On mélange l'ordre des zones de durée sur l'écran
  }

  // --- Gestion des Popups ---
  closePopup() {
    this.currentPopup = 'NONE'; // Ferme le popup en disant qu'aucun popup n'est affiché
  }

  // --- Validation (C'est ici qu'on vérifie si le joueur a gagné) ---
  btnValider() {
    // 1. Vérification préliminaire : est-ce que toutes les cartes ont été placées ?
    // Si la pioche ('cartes') n'est pas vide, c'est que le joueur n'a pas fini.
    if (this.cartes.length > 0) {
      this.currentPopup = 'INCOMPLETE'; // On affiche le message "Incomplet"
      return; // On s'arrête là
    }

    // 2. Vérification des réponses
    let allCorrect = true; // On part du principe que tout est bon
    const incorrectCards: string[] = []; // Liste pour stocker les erreurs

    // On regarde chaque zone de durée une par une
    this.zones.forEach(zone => {
      if (zone.items.length > 0) {
        // On regarde quelle carte le joueur a mise dans cette zone
        const cardValue = zone.items[0];
        // On regarde quelle était la bonne durée pour cette carte (dans nos solutions secrètes)
        const correctDuration = this.solutions[cardValue];

        // Si la durée de la zone ne correspond pas à la durée correcte de la carte
        if (correctDuration !== zone.label) {
          // Mauvaise réponse !
          allCorrect = false;
          incorrectCards.push(cardValue); // On note que cette carte est fausse
          zone.items = []; // On retire la carte de la zone (elle retournera dans la pioche)
        } else {
          // Bonne réponse : on ne fait rien, la carte reste là où elle est (c'est validé)
        }
      }
    });

    // Si tout est correct (aucune erreur trouvée)
    if (allCorrect) {
      this.currentPopup = 'VICTORY'; // On affiche le message de victoire
      this.triggerConfetti(); // On lance l'animation de cotillons
    } else {
      // S'il y a des erreurs
      // On remet les cartes fausses dans la pioche pour que le joueur réessaie
      this.cartes.push(...incorrectCards);
      this.currentPopup = 'DEFEAT'; // On affiche le message "Dommage..."
    }
  }

  // --- Animation de victoire ---
  triggerConfetti() {
    const duration = 3000; // L'animation dure 3 secondes
    const end = Date.now() + duration;

    // Cette petite fonction tourne en boucle pour créer l'animation
    (function frame() {
      // Lance des confettis depuis le coin gauche
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#507693', '#A8BDCE', '#FFFFFF'] // Les couleurs utilisées (bleu, gris, blanc)
      });
      // Lance des confettis depuis le coin droit
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#507693', '#A8BDCE', '#FFFFFF']
      });

      // Si le temps n'est pas écoulé, on recommence pour l'image suivante
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }

  // --- Actions des boutons ---

  // Appelé quand le joueur clique sur "Recommencer"
  resetGame() {
    this.startNewLevel(); // Relance une partie
    this.closePopup(); // Ferme le menu
  }

  // Appelé quand le joueur clique sur "Boîte à outils"
  goToTools() {
    this.router.navigate(['/boite-a-outils']); // Change de page
  }

  // --- Gestion du Glisser-Déposer (Drag & Drop) ---
  // Cette fonction est appelée automatiquement quand le joueur lâche une carte
  drop(event: CdkDragDrop<string[]>) {
    // Si on lâche la carte au même endroit d'où elle vient (on change juste l'ordre)
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Si on déplace la carte vers une autre zone (ex: de la pioche vers une zone de durée)

      // On vérifie si la zone d'arrivée est une zone cible (pas la pioche)
      const isTargetZone = event.container.data !== this.cartes;

      // Règle du jeu : Une zone de durée ne peut contenir qu'une seule carte
      // Si c'est une zone cible et qu'elle est déjà pleine (length >= 1), on interdit le dépôt
      if (isTargetZone && event.container.data.length >= 1) {
        return; // On annule l'action, la carte retourne à sa place
      }

      // Si tout est bon, on effectue le déplacement de la carte d'une liste à l'autre
      transferArrayItem(
        event.previousContainer.data, // Liste de départ
        event.container.data,         // Liste d'arrivée
        event.previousIndex,          // Position de départ
        event.currentIndex,           // Position d'arrivée
      );
    }
  }
}
