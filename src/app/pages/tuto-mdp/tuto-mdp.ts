import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Lectureaudio } from "../../elements/lectureaudio/lectureaudio";
import { Testeurmdp } from "../../elements/testeurmdp/testeurmdp";

// --- Composant Tutoriel Mot de Passe ---
// Page pédagogique expliquant les bonnes pratiques et méthodes de création de mots de passe.
@Component({
  selector: 'app-tuto-mdp',
  imports: [RouterLink, Lectureaudio, Testeurmdp],
  templateUrl: './tuto-mdp.html',
  styleUrl: './tuto-mdp.css',
})
export class TutoMdp {

  // --- Contenu Intro ---
  introTitle: string = "Je crée mon mot de passe";
  introSubtitle: string = "Pourquoi est-ce important ?";
  introText: string = "Sécuriser ses comptes est devenu primordial. Votre mot de passe est souvent la seule barrière entre vos données personnelles et des personnes malveillantes. Mais comment créer un mot de passe qui soit à la fois robuste (difficile à craquer) et mémorisable ?";

  // --- Contenu Rappels ---
  basicsTitle: string = "Les Fondamentaux";
  basicsList: string[] = [
    "Longueur : 12 caractères minimum (plus c'est long, mieux c'est).",
    "Variété : Mélangez Majuscules, minuscules, Chiffres et Caractères spéciaux (! @ # $ % ...).",
    "Anonymat : Aucune information personnelle (Nom, Date de naissance, Nom du chien, Ville...).",
    "Unicité : Un mot de passe différent pour chaque compte.",
    "Indépendance : Pas de suites logiques (123456, azerty) ni de mots du dictionnaire seuls."
  ];

  // --- Contenu Méthodes ---
  methodsTitle: string = "Les Méthodes de Création";

  methodPhoneticTitle: string = "1. La Méthode Phonétique";
  methodPhoneticDesc: string = "Cette méthode consiste à utiliser une phrase que vous pouvez retenir facilement, et à ne garder que les sons ou les premières lettres de chaque mot.";
  methodPhoneticSteps: string[] = [
    "Choisissez une phrase simple : \"J'ai acheté huit cd pour cent-vingt euros cet après-midi !\"",
    "Transformez en sons/sigles : <ul><li>\"J'ai\" &#10140; G</li><li>\"acheté\" &#10140; ht</li><li>\"huit\" &#10140; 8</li><li>\"cd\" &#10140; CD</li><li>\"pour cent\" &#10140; %</li><li>\"vingt\" &#10140; 2O</li><li>\"euros\" &#10140; €</li><li>\"cet\" &#10140; 7</li><li>\"après-midi\" &#10140; am</li><li>\"!\" &#10140; !</li></ul>",
    "Résultat final : Ght8CD%2O€7am!"
  ];

  methodPassphraseTitle: string = "2. La Phrase de Passe (Passphrase)";
  methodPassphraseDesc: string = "Plus longue à taper mais très robuste et facile à retenir. Elle consiste à enchaîner plusieurs mots choisis aléatoirement.";
  methodPassphraseSteps: string[] = [
    "Prenez 5 ou 6 mots au hasard dans le dictionnaire ou autour de vous (sans lien logique).",
    "Exemple : \"Correction\", \"Cheval\", \"Batterie\", \"Agrafe\", \"Lune\".",
    "Attachez-les avec un séparateur (tiret, point, slash...).",
    "Résultat final : Correction-Cheval-Batterie-Agrafe-Lune"
  ];

  methodGeneratorTitle: string = "3. Le Générateur Automatique";
  methodGeneratorDesc: string = "Pourquoi se fatiguer ? Laissez un logiciel (Gestionnaire de mots de passe) créer des codes aléatoires parfaits et impossibles à deviner.";
  methodGeneratorSteps: string[] = [
    "Ouvrez votre gestionnaire (<a href='https://bitwarden.com/fr-fr/' target='_blank' rel='noopener noreferrer'>Bitwarden</a>, <a href='https://keepass.info/' target='_blank' rel='noopener noreferrer'>KeePass</a>, ...).",
    "Cliquez sur 'Générer un mot de passe'.",
    "Réglez la longueur sur 15 caractères ou plus.",
    "Le logiciel le crée, le remplit et le sauvegarde pour vous !"
  ];

  // --- Contenu Bonnes Pratiques ---
  bestPracticesTitle: string = "Pour aller plus loin";
  bestPracticesList: string[] = [
    "Double Authentification (2FA) : Activez-la partout où c'est possible. Même si votre mot de passe est volé, le pirate aura besoin de votre téléphone.",
    "Gestionnaire de mots de passe : Utilisez des outils comme <a href='https://bitwarden.com/fr-fr/' target='_blank' rel='noopener noreferrer'>Bitwarden</a> ou <a href='https://keepass.info/' target='_blank' rel='noopener noreferrer'>KeePass</a>. Vous n'aurez qu'un seul mot de passe maître à retenir, le logiciel gère les autres (et les génère !).",
    "Vigilance : Ne tapez jamais votre mot de passe sur un ordinateur public ou inconnu."
  ];
  // --- Audio Getters ---
  get introAudio(): string {
    return this.introSubtitle + ". " + this.introText;
  }

  get basicsAudio(): string {
    return this.basicsTitle + ". " + this.basicsList.join(". ");
  }

  get phoneticAudio(): string {
    return this.methodPhoneticTitle + ". " + this.methodPhoneticDesc + ". " + this.methodPhoneticSteps.join(". ");
  }

  get passphraseAudio(): string {
    return this.methodPassphraseTitle + ". " + this.methodPassphraseDesc + ". " + this.methodPassphraseSteps.join(". ");
  }

  get generatorAudio(): string {
    return this.methodGeneratorTitle + ". " + this.methodGeneratorDesc + ". " + this.methodGeneratorSteps.join(". ");
  }

  get bestPracticesAudio(): string {
    return this.bestPracticesTitle + ". " + this.bestPracticesList.join(". ");
  }
}
