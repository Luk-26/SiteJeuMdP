import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-generateurmdp',
  imports: [FormsModule, CommonModule],
  templateUrl: './generateurmdp.html',
  styleUrl: './generateurmdp.css',
})
export class Generateurmdp {
  constructor(private cdr: ChangeDetectorRef) { }

  // --- Binding Properties (Liens avec le HTML) ---
  length: number = 12;
  useUppercase: boolean = true;
  useLowercase: boolean = true;
  useNumbers: boolean = true;
  useSpecial: boolean = false;

  generatedPassword: string = 'Cliquer sur générer';
  errorMessage: string = '';
  copyBtnText: string = 'Copier';

  // --- Logic ---

  genererMdp() {
    // 1. Validation
    if (this.length < 4 || this.length > 128) {
      this.errorMessage = 'La longueur doit être comprise entre 4 et 128 caractères';
      return;
    }

    if (!this.useUppercase && !this.useLowercase && !this.useNumbers && !this.useSpecial) {
      this.errorMessage = 'Au moins un type de caractères doit être sélectionné';
      return;
    }

    this.errorMessage = ''; // Reset error

    // 2. Préparation des caractères disponibles via Binding
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

    // 3. Génération sécurisée avec window.crypto
    let newPassword = '';

    // On remplit un tableau d'octets aléatoires (plus sûr que Math.random)
    const randomValues = new Uint32Array(this.length);
    window.crypto.getRandomValues(randomValues);

    for (let i = 0; i < this.length; i++) {
      // On utilise le nombre aléatoire pour choisir un index dans availableChars
      const randomIndex = randomValues[i] % availableChars.length;
      newPassword += availableChars.charAt(randomIndex);
    }

    this.generatedPassword = newPassword;
  }

  copierMdp() {
    if (!this.generatedPassword || this.generatedPassword === 'Cliquer sur générer') return;

    // Fonction interne pour gérer le succès visuel
    const onSuccess = () => {
      this.copyBtnText = 'Copié !';
      this.cdr.detectChanges();
      setTimeout(() => {
        this.copyBtnText = 'Copier';
        this.cdr.detectChanges();
      }, 2000);
    };

    // Tentative 1 : API Clipboard moderne (nécessite souvent HTTPS)
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(this.generatedPassword)
        .then(onSuccess)
        .catch(() => this.fallbackCopy(onSuccess)); // Si échec, on tente la méthode "bourrin"
    } else {
      // Tentative 2 : Fallback direct si l'API n'existe pas
      this.fallbackCopy(onSuccess);
    }
  }

  // Méthode de secours pour copier (marche mieux sur mobile en HTTP/Dev)
  fallbackCopy(callback: () => void) {
    const textArea = document.createElement("textarea");
    textArea.value = this.generatedPassword;

    // S'assurer que le textarea n'est pas visible mais fait partie du document
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);

    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      callback();
    } catch (err) {
      console.error('Impossible de copier', err);
      // Fallback ultime : on pourrait afficher un prompt, mais c'est intrusif
    }

    document.body.removeChild(textArea);
  }
}
