# Ruche Expert

Application Vite/React pour gérer un rucher : visites, colonies, récoltes, inventaire et base de connaissance.

## Fonctionnalités principales
- **Visites** : saisie rapide et page dédiée au suivi/consultation pour filtrer et ajuster les inspections.
- **Ruches** : création des colonies séparée d’une page de suivi pour les mises à jour terrain.
- **Récoltes** : enregistrement des lots avec humidité, mise à jour d’un lot existant et suivi de la mise en pots.
- **Inventaire** : ajout d’articles avec catégories préremplies ou personnalisées, prix, commentaires et tableau de stock.
- **Mouvements** : journal des ventes/dons/prêts/destructions de matériel ou pots de miel.
- **Base de connaissance** : consultation et page d’édition sous l’administration pour contacts, liens utiles et documents importés/localisés.
- **Sauvegarde** : persistance locale (localStorage) et import/export via l’administration, génération et téléchargement de rapports (visites, inventaires, récoltes).
- **Navigation dynamique** : menu latéral repliable avec sous-menus « Visites », « Récoltes » et « Rucher » pour la vie du rucher.

## Démarrage
```bash
npm install
# Récupérer les visuels localisés avant l'exécution
# (voir docs/image_download_commands.md pour les commandes détaillées)
# -> exécuter les commandes curl décrites dans le document

## Jeu de données démo
- Un export JSON prêt à l'emploi est disponible dans `public/demo-backup.json`.
- Connectez-vous avec le compte démo (identifiant `apiculteur-demo`, mot de passe `demo`), ouvrez la page « Administration » puis importez le fichier pour préremplir toutes les sections (ruchers, ruches, visites, récoltes, inventaire, base de connaissance et mouvements).
npm run dev
```
L’interface est disponible par défaut sur http://localhost:5173.

## Structure des pages
- `/` : tableau de bord synthétique
- `/visit` : saisie d’une visite
- `/visits` : suivi/consultation des visites
- `/hives` : création de ruche
- `/hives/review` : consultation et mise à jour des ruches
- `/harvest` : saisie des récoltes (avec mise en pots)
- `/inventory` : gestion du stock et des mouvements
- `/knowledge` : base de connaissance
- `/knowledge/edit` et `/administration/knowledge` : édition de la base de connaissance
