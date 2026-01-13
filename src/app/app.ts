import { Component, signal, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./elements/navbar/navbar";
import { Footer } from "./elements/footer/footer";

// --- Composant Racine de l'Application ---
// Structure globale incluant la barre de navigation, le contenu principal (RouterOutlet) et le pied de page.
// Gère également le bouton "Retour en haut".
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Titre de l'application (Signal).
  protected readonly title = signal('SiteJeuMdP');

  // État de visibilité du bouton de retour en haut.
  protected showScrollButton = false;

  // Écouteur d'événement de défilement (scroll) sur la fenêtre.
  // Affiche le bouton si on descend de plus de 300px.
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScrollButton = window.scrollY > 300;
  }

  // Fait remonter la page tout en haut avec un défilement fluide.
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
