import { Component, Input, Inject, PLATFORM_ID, NgZone, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

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

    // Annuler toute lecture en cour (global) pour éviter la queue
    window.speechSynthesis.cancel();

    this.synthese = new SpeechSynthesisUtterance(this.texte);
    this.synthese.lang = 'fr-FR';
    this.synthese.rate = 1;
    this.synthese.pitch = 1;
    this.synthese.volume = 1;

    const cleanup = () => {
      this.ngZone.run(() => {
        this.lecture = false;
        this.cdr.detectChanges();
      });
    };

    this.synthese.addEventListener('end', cleanup);
    this.synthese.addEventListener('error', cleanup);

    window.speechSynthesis.speak(this.synthese);
    this.lecture = true;
  }

  arreterLecture() {
    if (!this.isBrowser) return;

    window.speechSynthesis.cancel();
    this.lecture = false;
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.arreterLecture();
  }
}
