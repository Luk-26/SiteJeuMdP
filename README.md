# Site Jeu Maux de Passe & Outils Cybersécurité

## À propos du projet
Ce site web a pour vocation de sensibiliser les utilisateurs aux bonnes pratiques de cybersécurité, et plus particulièrement à la création et à la gestion de mots de passe robustes. Il a été développé dans le cadre d'un stage.

### Fonctionnalités
*   **Jeu "Maux de Passe"** : Un jeu interactif de glisser-déposer pour apprendre à estimer la résistance des mots de passe face aux attaques par force brute.
*   **Générateur de Mots de Passe** : Un outil personnalisable (longueur, caractères spéciaux, etc.) pour créer des mots de passe forts.
*   **Testeur de Mots de Passe** : Un outil utilisant la technologie `zxcvbn` pour évaluer la force d'un mot de passe et estimer son temps de craquage (traitement 100% local et sécurisé).
*   **Accueil** : Présentation, explications et liens vers des sites de référence.

## Guide de contribution

### Prérequis
*   Node.js (Version LTS recommandée)
*   Angular CLI

### Installation et Lancement
1.  **Cloner le dépôt** :
    ```bash
    git clone [URL_DU_DEPOT]
    cd SiteJeuMdP
    ```
2.  **Installer les dépendances** :
    ```bash
    npm install
    ```
3.  **Lancer le serveur de développement** :
    ```bash
    ng serve
    ```
    Ouvrez votre navigateur à l'adresse `http://localhost:4200/`.

## Stack Technique
*   **Framework** : Angular 19+
*   **Styles** : CSS Vanilla (Design responsive et moderne)
*   **Bibliothèques clés** : 
    *   `zxcvbn` (Estimation force mot de passe)
    *   `canvas-confetti` (Effets visuels)
    *   `@angular/cdk` (Drag & Drop)

## Crédits

### Équipe de développement
*   **Lucas GUILLEMAUD** - *Développement*
*   **Robin FECHOZ** - *Ingénierie Pédagogique*

### Remerciements
*   [[CMQ IED_AURA]](https://cmqiedaura.fr)
