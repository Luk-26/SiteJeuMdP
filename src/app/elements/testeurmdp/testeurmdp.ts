import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import zxcvbn from 'zxcvbn';

// --- Composant Testeur de Mot de Passe ---
// Permet à l'utilisateur de saisir un mot de passe et d'obtenir une estimation de sa sécurité.
@Component({
  selector: 'app-testeurmdp',
  imports: [FormsModule, RouterModule],
  templateUrl: './testeurmdp.html',
  styleUrl: './testeurmdp.css',
})
export class Testeurmdp {
  password: string = '';
  isVisible: boolean = false; // Pour basculer l'affichage du mot de passe
  score: number = 0; // Score de 0 à 4 renvoyé par zxcvbn
  progressValue: number = 0; // Pourcentage pour la barre de progression
  crackTimeDisplay: string = '-'; // Texte affiché pour le temps de craquage

  // Analyser le mot de passe saisi et calculer sa complexité.
  checkPassword() {
    if (!this.password) {
      this.score = 0;
      this.progressValue = 0;
      this.crackTimeDisplay = '-';
      return;
    }

    // Utilisation de la bibliothèque zxcvbn pour l'estimation de la force.
    const result = zxcvbn(this.password);
    this.score = result.score;

    // Scénario d'attaque : hachage lent hors ligne (10^4 essais/seconde), standard pour évaluer la résistance.
    // Le pourcentage est calculé sur une échelle logarithmique.
    // 10^12 secondes (environ 31 000 ans) correspond au score maximal de 100%.
    const seconds = Number(result.crack_times_seconds.offline_slow_hashing_1e4_per_second);
    if (seconds < 1) {
      this.progressValue = 0;
    } else {
      this.progressValue = Math.min(100, (Math.log10(seconds) / 12) * 100);
    }

    this.crackTimeDisplay = this.formatDuration(seconds);
  }

  // Bascule l'état de visibilité du mot de passe
  toggleVisibility() {
    this.isVisible = !this.isVisible;
  }

  // Convertit une durée en secondes en un texte lisible (ex: "3 jours", "2 millions d'années").
  // Gère les unités de l'instantané jusqu'aux billions d'années.
  private formatDuration(seconds: number): string {
    if (seconds < 1) return "Instantané";
    if (seconds < 60) return `${Math.round(seconds)} secondes`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes`;

    const hours = Math.floor(seconds / 3600);
    if (hours < 24) return `${hours} heures`;

    const days = Math.floor(seconds / 86400);
    if (days < 31) return `${days} jours`;

    const months = Math.floor(days / 30.44);
    if (months < 12) return `${months} mois`;

    const years = days / 365.25;

    if (years < 1000000) {
      return `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(years)} ans`;
    }

    if (years < 1000000000) {
      const millions = years / 1000000;
      return `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(millions)} millions d'années`;
    }

    if (years < 1000000000000) {
      const billions = years / 1000000000;
      return `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(billions)} milliards d'années`;
    }

    const trillions = years / 1000000000000;
    return `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(trillions)} billions d'années`;
  }
}