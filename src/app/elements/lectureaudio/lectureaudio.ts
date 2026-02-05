import { Component, Input, Inject, PLATFORM_ID, NgZone, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// --- Composant Lecture Audio ---
// Bouton permettant de lire le contenu textuel de la page via la synthèse vocale du navigateur.
@Component({
  selector: 'app-lectureaudio',
  imports: [],
  templateUrl: './lectureaudio.html',
  styleUrl: './lectureaudio.css',
})
export class Lectureaudio {
  lecture: boolean = false;
  @Input() texte: string = "";
  synthese: SpeechSynthesisUtterance | null = null;

  isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      if (!('speechSynthesis' in window)) {
        console.error('Le navigateur ne supporte pas la synthese vocale');
      }
    }
  }

  lectureAudio() {
    if (this.lecture) {
      this.arreterLecture();
    } else {
      this.demarrerLecture();
    }
  }

  demarrerLecture() {
    if (!this.isBrowser) return;

    // Annuler toute lecture en cours (global) pour éviter la queue
    window.speechSynthesis.cancel();

    this.synthese = new SpeechSynthesisUtterance(this.texte);
    this.synthese.lang = 'fr-FR';
    this.synthese.rate = 1;
    this.synthese.pitch = 1;
    this.synthese.volume = 1;

    // Utilisation des propriétés onend/onerror pour pouvoir les nettoyer facilement
    this.synthese.onend = () => {
      this.ngZone.run(() => {
        this.lecture = false;
        this.cdr.detectChanges();
      });
    };

    this.synthese.onerror = (event) => {
      console.error('Erreur synthèse vocale', event);
      this.ngZone.run(() => {
        this.lecture = false;
        this.cdr.detectChanges();
      });
    };

    window.speechSynthesis.speak(this.synthese);
    this.lecture = true;
  }

  arreterLecture() {
    if (!this.isBrowser) return;

    // Nettoyage des événements pour éviter les appels parasites
    if (this.synthese) {
      this.synthese.onend = null;
      this.synthese.onerror = null;
    }

    window.speechSynthesis.cancel();
    this.lecture = false;
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.arreterLecture();
  }
}
