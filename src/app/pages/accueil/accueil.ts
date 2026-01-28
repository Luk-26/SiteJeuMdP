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
  textePresentation: string = "Le Campus des Métiers et des Qualifications Informatique et Électronique de Demain [CMQ IED_AURA] est un label trans-ministériel qui réunit à l’échelle de la région Auvergne-Rhône-Alpes des établissements de formation, des laboratoires de recherche, des entreprises et des institutions. Ce réseau d’acteurs se donne 3 missions :";

  missionsPresentation: string[] = [
    "Soutenir le développement d’une filière porteuse d’avenir.",
    "Maintenir des compétences dans un territoire.",
    "Améliorer l’excellence de la formation."
  ];

  texteCybersecurite: string = "La cybersécurité regroupe l'ensemble des pratiques visant à protéger les ordinateurs, les serveurs, les appareils mobiles et les données contre les attaques malveillantes. Dans un monde hyper-connecté, la vigilance est la clé de la protection.";

  texteMotsDePasse: string = "Un mot de passe robuste est votre première ligne de défense. Voici quelques bonnes pratiques :";

  conseilsMotsDePasse: string[] = [
    "Utilisez au moins 12 caractères mêlant majuscules, minuscules, chiffres et symboles.",
    "Évitez les informations personnelles (dates de naissance, noms).",
    "Utilisez un mot de passe unique pour chaque service.",
    "Utilisez un gestionnaire de mots de passe pour stocker vos identifiants en toute sécurité."
  ];

  texteCraquageMotsDePasse: string = "Il existe plusieurs méthodes pour craquer un mot de passe :";

  methodesCraquageMotsDePasse: string[] = [
    "Force Brute (Brute Force) : Un logiciel teste toutes les combinaisons possibles de touches une par une jusqu'à tomber sur la bonne.",
    "Dictionnaire : Le logiciel teste une liste énorme de mots existants (dictionnaire, noms de villes, prénoms, équipes de foot) et de mots de passe courants.",
    "Ingénierie Sociale (Social Engineering) : Un attaquant tente de vous convaincre de divulguer votre mot de passe de façon plus ou moins agressive.",
  ];

  texteCraquageMotsDePasseFin: string = "Il existe aussi d'autres méthodes tel que le Keylogger (Enregistreur de frappe), Spidering (espionnage de vos réseaux sociaux), Phishing (Hameçonnage) et bien d'autres.";

  texteRessources: string = "Pour approfondir vos connaissances, consultez les sites suivants :";

  get textePresentationAudio(): string {
    return this.textePresentation + " " + this.missionsPresentation.join(" ");
  }

  get texteMotsDePasseAudio(): string {
    return this.texteMotsDePasse + " " + this.conseilsMotsDePasse.join(" ");
  }

  get texteCraquageMotsDePasseAudio(): string {
    return this.texteCraquageMotsDePasse + " " + this.methodesCraquageMotsDePasse.join(" ") + this.texteCraquageMotsDePasseFin;
  }
}