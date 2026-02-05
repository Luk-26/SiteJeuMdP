# Site Jeu Maux de Passe & Outils Cybersécurité

## À propos du projet
Ce site web a pour vocation de sensibiliser les utilisateurs aux bonnes pratiques de cybersécurité, et plus particulièrement à la création et à la gestion de mots de passe robustes.
Il a été développé par [Lucas GUILLEMAUD](https://lucasguillemaud-portfolio.netlify.app) lors du stage de 2e année de BTS SIO au lycée Algoud Laffemas dans le cadre du projet CyberSkills@UGA au [[CMQ IED_AURA]](https://cmqiedaura.fr).

### Fonctionnalités
*   **Jeu "Maux de Passe"** : Un jeu interactif de glisser-déposer pour apprendre à estimer la résistance des mots de passe face aux attaques par force brute.
*   **Tuto "Je crée mon mot de passe"** : Un guide étape par étape présentant les fondamentaux, des méthodes concrètes (phonétique, phrase de passe) et l'utilisation des gestionnaires de mots de passe.
*   **Générateur de Mots de Passe** : Un outil personnalisable (longueur, caractères spéciaux, etc.) pour créer des mots de passe forts.
*   **Testeur de Mots de Passe** : Un outil utilisant la technologie `zxcvbn` pour évaluer la force d'un mot de passe et estimer son temps de craquage (traitement 100% local et sécurisé).
*   **Lecture Audio** : Une fonctionnalité d'accessibilité permettant d'écouter le contenu des pages (Accueil et Tutoriel) pour une meilleure inclusion.
*   **Accueil** : Présentation, explications et liens vers des sites de référence.

---

## 🚀 Guide d'Installation (Pas à Pas)

Cette section est conçue pour être suivie par n'importe qui, même sans connaissances techniques.

### Étape 1 : Installer les logiciels nécessaires
Pour que le site fonctionne sur votre ordinateur, vous avez besoin d'un moteur appelé **Node.js**.
1.  Allez sur le site officiel : **[nodejs.org](https://nodejs.org/en/download/)**.
2.  Téléchargez la version recommandée (**LTS**).
3.  Installez-le comme un logiciel classique (faites "Suivant" jusqu'à la fin).

### Étape 2 : Récupérer le code du site
Deux options s'offrent à vous :
*   **Option Facile (ZIP)** : 
    1.  Cliquez sur le bouton vert **Code** en haut de la page GitHub (ou GitLab).
    2.  Choisissez **Download ZIP**.
    3.  Une fois téléchargé, faites un clic droit sur le fichier ZIP et choisissez **"Extraire tout"**.
*   **Option Avancée (Git)** :
    Ouvrez un terminal et tapez : `git clone [URL_DU_DEPOT]`

### Étape 3 : Installer et Lancer le site
1.  Ouvrez le dossier du projet que vous venez de récupérer/extraire (vous devez y voir un fichier nommé `package.json`).
2.  Faites un **clic droit** dans un espace vide du dossier, puis sélectionnez **"Ouvrir dans le terminal"** (ou "PowerShell", ou "Invite de commandes").
3.  Dans la fenêtre qui s'ouvre (souvent bleue ou noire), tapez cette commande et appuyez sur la touche **Entrée** :
    ```bash
    npm install
    ```
    *(Attendez quelques minutes que les téléchargements se terminent).*

4.  Une fois terminé, tapez cette commande pour démarrer le site :
    ```bash
    npm start
    ```

5.  Ouvrez votre navigateur internet (Chrome, Firefox, Edge...) et allez à l'adresse suivante :
    👉 **http://localhost:4200/**

---

## 🛠️ Section Technique (Pour Développeurs)

### Prérequis
*   **Node.js** (Version LTS)
*   **Angular CLI** (optionnel si vous utilisez `npm start` qui utilise la version locale)

### Commandes Utiles
*   `ng serve` : Lance le serveur de développement (ou `npm start`).
*   `ng build` : Compile le projet pour la production dans le dossier `dist/` (ou `npm run build`).
*   `ng serve --host 0.0.0.0` : Lance le serveur accessible depuis le réseau local.

### Stack Technique
*   **Framework** : Angular 21+
*   **Langage** : TypeScript
*   **Styles** : CSS Vanilla (Design responsive et moderne)
*   **Bibliothèques clés** : 
    *   `zxcvbn` (Estimation force mot de passe)
    *   `canvas-confetti` (Effets visuels)
    *   `@angular/cdk` (Drag & Drop)

---

## Crédits

### Équipe de développement
*   **[Lucas GUILLEMAUD](https://lucasguillemaud-portfolio.netlify.app)** - *Développeur*
*   **[Robin FECHOZ](https://www.linkedin.com/in/robin-fechoz-7579b9222/)** - *Ingénierie Pédagogique*

### Remerciements
*   [[CMQ IED_AURA]](https://cmqiedaura.fr)
