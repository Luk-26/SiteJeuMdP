import { Component, Input, Inject, PLATFORM_ID } from '@angular/core';
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

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
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

    this.synthese = new SpeechSynthesisUtterance(this.texte);
    this.synthese.lang = 'fr-FR';
    this.synthese.rate = 1;
    this.synthese.pitch = 1;
    this.synthese.volume = 1;
    this.synthese.onend = () => {
      this.lecture = false;
    };
    window.speechSynthesis.speak(this.synthese);
    this.lecture = true;
  }

  arreterLecture() {
    if (!this.isBrowser) return;

    window.speechSynthesis.cancel();
    this.lecture = false;
  }

  ngOnDestroy() {
    this.arreterLecture();
  }
}
