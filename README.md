# Ruche Expert

Application Vite/React pour gérer un rucher : visites, colonies, récoltes, inventaire et base de connaissance.

## Fonctionnalités principales
- **Visites** : saisie rapide et page dédiée au suivi/consultation pour filtrer et ajuster les inspections.
- **Ruches** : création des colonies séparée d’une page de suivi pour les mises à jour terrain.
- **Récoltes** : enregistrement des lots avec humidité et suivi de la mise en pots.
- **Inventaire** : ajout d’articles avec catégories préremplies ou personnalisées, prix, commentaires et tableau de stock.
- **Mouvements** : journal des ventes/dons/prêts/destructions de matériel ou pots de miel.
- **Base de connaissance** : consultation et page d’édition pour contacts, liens utiles et documents.
- **Sauvegarde** : persistance locale (localStorage) et import/export via l’administration.

## Démarrage
```bash
npm install
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
- `/knowledge/edit` : édition de la base de connaissance
