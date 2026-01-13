import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Lectureaudio } from "../../elements/lectureaudio/lectureaudio";

// --- Composant Page d'Accueil ---
// Page de présentation principale du site.
@Component({
  selector: 'app-accueil',
  imports: [RouterLink, Lectureaudio],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css',
})
export class Accueil {
  textePresentation: string = "Bienvenue sur notre portail dédié à la sécurité numérique. Notre mission est de vous accompagner dans la protection de votre vie privée en ligne et de vos données sensibles.";

  texteCybersecurite: string = "La cybersécurité regroupe l'ensemble des pratiques visant à protéger les ordinateurs, les serveurs, les appareils mobiles et les données contre les attaques malveillantes. Dans un monde hyper-connecté, la vigilance est la clé de la protection.";

  texteMotsDePasse: string = "Un mot de passe robuste est votre première ligne de défense. Voici quelques bonnes pratiques :";

  texteRessources: string = "Pour approfondir vos connaissances, consultez les sites officiels suivants :";
}
