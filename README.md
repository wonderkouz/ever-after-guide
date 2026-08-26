# Ever After Guide

Je veux créer une application web appelée provisoirement "Wedly".

Wedly est un copilote intelligent pour aider les futurs mariés à organiser leur mariage.

L'application doit être élégante, moderne, chaleureuse et premium. Elle ne doit pas avoir une esthétique clichée de wedding planner. Utiliser une interface très épurée, beaucoup d'espace blanc, une typographie élégante et une navigation intuitive.

Pour cette première version, je veux uniquement construire :

1. UNE PAGE DE BIENVENUE

Titre :

"Votre mariage, organisé simplement."

Sous-titre :

"Un copilote intelligent qui vous accompagne jusqu'au grand jour."

Bouton :

"Commencer mon mariage"

2. CRÉATION DU MARIAGE

Créer un formulaire étape par étape demandant :

- Prénom

- Prénom du/de la partenaire

- Date du mariage

- Nombre d'invités

- Budget total

- Lieu du mariage

- Type de cérémonie

- Style du mariage

Types de cérémonie :

- Cérémonie civile

- Cérémonie religieuse

- Cérémonie laïque

- Plusieurs cérémonies

- Je ne sais pas encore

Créer ensuite le profil du mariage.

3. DASHBOARD

Afficher :

- prénoms des mariés

- date du mariage

- nombre de jours avant le mariage

- nombre d'invités

- budget total

- pourcentage d'organisation

Créer une section :

"À faire maintenant"

Afficher les prochaines tâches importantes.

Créer également une section :

"Votre progression"

Afficher une barre de progression basée sur les tâches terminées.

4. PLANNING

Créer une checklist de mariage.

Les tâches doivent être automatiquement générées en fonction de la date du mariage.

Les tâches doivent être organisées par périodes :

- 12 mois et +

- 9 à 12 mois

- 6 à 9 mois

- 3 à 6 mois

- 1 à 3 mois

- Dernier mois

- Dernière semaine

- Jour J

Chaque tâche possède :

- un titre

- une description

- une échéance

- une priorité

- un statut terminé/non terminé

L'utilisateur doit pouvoir cocher une tâche.

Quand une tâche est terminée :

- mettre à jour le pourcentage d'organisation

- mettre à jour le dashboard

- retirer la tâche des tâches prioritaires si nécessaire

IMPORTANT :

Utiliser une architecture propre permettant d'ajouter plus tard :

- un budget intelligent

- l'import et l'analyse de devis avec l'IA

- un assistant IA connaissant le contexte du mariage

- la gestion des invités

- les prestataires

Pour l'instant, ne crée pas ces fonctionnalités. Prépare simplement une architecture qui permettra de les ajouter facilement.

L'application doit être responsive et fonctionner correctement sur ordinateur et mobile.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e492c218-c818-49c7-9e89-9e4ebcdc92e6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
