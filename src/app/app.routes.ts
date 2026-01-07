import { Routes } from '@angular/router';
import { Accueil } from './pages/accueil/accueil';
import { Jeumdp } from './pages/jeumdp/jeumdp';
import { Outils } from './pages/outils/outils';

export const routes: Routes = [
    { path: '', component: Accueil },
    { path: 'jeu-mdp', component: Jeumdp },
    { path: 'boite-a-outils', component: Outils },
];
