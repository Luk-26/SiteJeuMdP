import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

// --- Composant Générateur de Mot de Passe ---
// Permet de générer des mots de passe sécurisés avec des critères configurables.
@Component({
  selector: 'app-generateurmdp',
  imports: [FormsModule, CommonModule],
  templateUrl: './generateurmdp.html',
  styleUrl: './generateurmdp.css',
})
export class Generateurmdp {
  constructor(private cdr: ChangeDetectorRef) { }

  // --- Propriétés liées au template (Data Binding) ---
  length: number = 12; // Longueur par défaut
  useUppercase: boolean = true;
  useLowercase: boolean = true;
  useNumbers: boolean = true;
  useSpecial: boolean = false;

  generatedPassword: string = 'Cliquer sur générer';
  errorMessage: string = '';
  copyBtnText: string = 'Copier';

  // --- Logique de génération ---

  genererMdp() {
    // 1. Validation des entrées utilisateur
    if (this.length < 4 || this.length > 128) {
      this.errorMessage = 'La longueur doit être comprise entre 4 et 128 caractères';
      return;
    }

    if (!this.useUppercase && !this.useLowercase && !this.useNumbers && !this.useSpecial) {
      this.errorMessage = 'Au moins un type de caractères doit être sélectionné';
      return;
    }

    this.errorMessage = ''; // Réinitialisation du message d'erreur

    // 2. Constitution de la liste des caractères éligibles
    const ensembles = {
      minuscule: 'abcdefghijklmnopqrstuvwxyz',
      majuscule: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      chiffre: '0123456789',
      special: '!@#$%^&*()_+{}[]<>?/-='
    };

    let availableChars = '';
    if (this.useLowercase) availableChars += ensembles.minuscule;
    if (this.useUppercase) availableChars += ensembles.majuscule;
    if (this.useNumbers) availableChars += ensembles.chiffre;
    if (this.useSpecial) availableChars += ensembles.special;

    // 3. Génération cryptographiquement sécurisée
    let newPassword = '';

    // Utilisation de Uint32Array et window.crypto pour l'aléatoire (plus robuste que Math.random)
    const randomValues = new Uint32Array(this.length);
    window.crypto.getRandomValues(randomValues);

    for (let i = 0; i < this.length; i++) {
      // Sélection d'un caractère aléatoire dans la liste disponible
      const randomIndex = randomValues[i] % availableChars.length;
      newPassword += availableChars.charAt(randomIndex);
    }

    this.generatedPassword = newPassword;
  }

  // Copie le mot de passe généré dans le presse-papier.
  copierMdp() {
    if (!this.generatedPassword || this.generatedPassword === 'Cliquer sur générer') return;

    // Gestion du retour visuel (changement du texte du bouton)
    const onSuccess = () => {
      this.copyBtnText = 'Copié !';
      this.cdr.detectChanges();
      setTimeout(() => {
        this.copyBtnText = 'Copier';
        this.cdr.detectChanges();
      }, 2000);
    };

    // Tentative 1 : API Clipboard moderne (standard actuel)
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(this.generatedPassword)
        .then(onSuccess)
        .catch(() => this.fallbackCopy(onSuccess)); // Repli en cas d'erreur
    } else {
      // Tentative 2 : Méthode de repli pour les navigateurs anciens ou contextes non sécurisés
      this.fallbackCopy(onSuccess);
    }
  }

  // Méthode de secours utilisant un textarea temporaire (compatible mobile/HTTP).
  fallbackCopy(callback: () => void) {
    const textArea = document.createElement("textarea");
    textArea.value = this.generatedPassword;

    // Positionnement hors écran
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);

    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy'); // Commande dépréciée mais largement supportée
      callback();
    } catch (err) {
      console.error('Impossible de copier', err);
    }

    document.body.removeChild(textArea);
  }
}
