# Revue de code

## Points d'attention

- Les comptes démo et admin ainsi que les utilisateurs créés sont stockés en clair (login et mot de passe) dans le localStorage côté navigateur. En cas de compromission du stockage, tous les identifiants sont immédiatement exposés ; il faudrait au minimum éviter de conserver les mots de passe en clair ou appliquer un mécanisme de hachage côté client. 【F:src/context/AuthContext.jsx†L7-L138】
- L'ajout d'une visite permet d'attacher un fichier photo encodé en base64 qui est stocké dans l'état puis persisté dans le localStorage via `BeeDataContext`. Une seule photo peut déjà consommer plusieurs méga-octets et saturer rapidement le quota (~5 MB) du navigateur, ce qui rendrait l'enregistrement ultérieur impossible sans gestion d'erreur. Il vaudrait mieux limiter la taille acceptée ou externaliser le stockage. 【F:src/pages/VisitEntry.jsx†L66-L99】【F:src/context/BeeDataContext.jsx†L119-L133】

## Recommandations

- Sécuriser la persistance des comptes en supprimant le stockage du mot de passe ou en appliquant un hachage côté client, et prévoir un flux d'authentification qui ne repose pas sur des secrets persistés en clair dans le navigateur.
- Plafonner ou refuser les pièces jointes volumineuses pour les visites, et prévoir un retour utilisateur clair en cas de dépassement du stockage local.
