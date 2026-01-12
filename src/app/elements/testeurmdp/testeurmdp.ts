import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import zxcvbn from 'zxcvbn';

@Component({
  selector: 'app-testeurmdp',
  imports: [FormsModule],
  templateUrl: './testeurmdp.html',
  styleUrl: './testeurmdp.css',
})
export class Testeurmdp {
  password: string = '';
  score: number = 0;
  progressValue: number = 0;
  crackTimeDisplay: string = '-';

  checkPassword() {
    if (!this.password) {
      this.score = 0;
      this.progressValue = 0;
      this.crackTimeDisplay = '-';
      return;
    }

    const result = zxcvbn(this.password);
    this.score = result.score;
    // We use 'offline_slow_hashing_1e4_per_second' as a standard offline attack scenario
    // We calculate a percentage based on log10 of seconds.
    // 10^12 seconds is approx 31,000 years, which we take as 100%.
    const seconds = Number(result.crack_times_seconds.offline_slow_hashing_1e4_per_second);
    if (seconds < 1) {
      this.progressValue = 0;
    } else {
      this.progressValue = Math.min(100, (Math.log10(seconds) / 12) * 100);
    }

    this.crackTimeDisplay = this.formatDuration(seconds);
  }

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
      return `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(years)} années`;
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