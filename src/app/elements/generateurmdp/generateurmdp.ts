import { Component } from '@angular/core';

@Component({
  selector: 'app-generateurmdp',
  imports: [],
  templateUrl: './generateurmdp.html',
  styleUrl: './generateurmdp.css',
})
export class Generateurmdp {
  genererMdp() {
    const longueur: number = parseInt((document.getElementById('longueur-mdp') as HTMLInputElement).value, 10);
    const majuscule: boolean = (document.getElementById('majuscule-mdp') as HTMLInputElement).checked;
    const minuscule: boolean = (document.getElementById('minuscule-mdp') as HTMLInputElement).checked;
    const chiffre: boolean = (document.getElementById('chiffre-mdp') as HTMLInputElement).checked;
    const special: boolean = (document.getElementById('special-mdp') as HTMLInputElement).checked;

    let mdp = '';

    const zoneErreur = document.getElementById('erreur-msg');

    if (longueur < 4 || longueur > 128) {
      if (zoneErreur) {
        zoneErreur.textContent = 'La longueur doit être comprise entre 4 et 128 caractères';
        zoneErreur.style.color = 'red';
      }
      return;
    }

    if (!majuscule && !minuscule && !chiffre && !special) {
      if (zoneErreur) {
        zoneErreur.textContent = 'Au moins un type de caractères doit être sélectionné';
        zoneErreur.style.color = 'red';
      }
      return;
    }

    const typesSelectionnes: ('minuscule' | 'majuscule' | 'chiffre' | 'special')[] = [];
    if (majuscule) typesSelectionnes.push('majuscule');
    if (minuscule) typesSelectionnes.push('minuscule');
    if (chiffre) typesSelectionnes.push('chiffre');
    if (special) typesSelectionnes.push('special');

    if (zoneErreur) {
      zoneErreur.textContent = '';
      zoneErreur.style.color = 'inherit';
    }

    // Zone de génération du mot de passe :
    for (let i = 0; i < longueur; i++) {
      const type = this.tirerTypeAleatoire(typesSelectionnes);
      mdp += this.genererCaractere(type);
    }

    document.getElementById('mdp')!.textContent = mdp;
    return;
  }

  genererCaractere(type: 'minuscule' | 'majuscule' | 'chiffre' | 'special'): string {
    const ensembles = {
      minuscule: 'abcdefghijklmnopqrstuvwxyz',
      majuscule: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      chiffre: '0123456789',
      special: '!@#$%^&*()_+|{}[]<>?/-='
    };
    const caracteres = ensembles[type];
    return caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }

  tirerTypeAleatoire(typesSelectionnes: ('minuscule' | 'majuscule' | 'chiffre' | 'special')[]): 'minuscule' | 'majuscule' | 'chiffre' | 'special' {
    return typesSelectionnes[Math.floor(Math.random() * typesSelectionnes.length)];
  }

  copierMdp() {
    const mdp = document.getElementById('mdp')?.textContent;
    if (mdp && mdp !== 'Cliquer sur générer') {
      navigator.clipboard.writeText(mdp).then(() => {
        const btn = document.querySelector('.btn-copy') as HTMLButtonElement;
        if (btn) {
          const originalText = btn.innerHTML;
          btn.innerHTML = 'Copié !';
          setTimeout(() => btn.innerHTML = originalText, 2000);
        }
      });
    }
  }
}
