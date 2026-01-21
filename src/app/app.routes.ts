import { Routes } from '@angular/router';
import { Accueil } from './pages/accueil/accueil';
import { Jeumdp } from './pages/jeumdp/jeumdp';
import { Outils } from './pages/outils/outils';

// Définition des routes de l'application.
// Associe des chemins d'URL à des composants spécifiques.
export const routes: Routes = [
    { path: '', component: Accueil, title: 'Accueil' }, // Page d'accueil (racine)
    { path: 'jeu-mdp', component: Jeumdp, title: 'Jeu maux de passe' }, // Jeu interactif
    { path: 'boite-a-outils', component: Outils, title: 'Boite à outils' }, // Outils (Générateur/Testeur)
];
