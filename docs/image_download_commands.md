# Téléchargement hors-merge des images locales

Les visuels ne sont pas versionnés (fichiers binaires exclus du dépôt) : exécutez ces commandes avant de lancer l’application pour déposer les images dans `public/images/` sans avoir besoin d’ouvrir une PR ou de lancer un merge.

## Pré-requis
- `curl` installé (présent par défaut dans la plupart des distributions).
- Être placé à la racine du projet (`/workspace/test_antigravity`).

## Exemple : télécharger chaque visuel individuellement
Remplacez les URLs par vos sources. Les noms de fichiers correspondent aux visuels actuellement utilisés par l’application.

```bash
# Créer le dossier s’il n’existe pas
mkdir -p public/images

# Télécharger les illustrations
curl -L "https://exemple.com/assets/auth-illustration.jpg" -o public/images/auth-illustration.jpg
curl -L "https://exemple.com/assets/hero.jpg" -o public/images/hero.jpg
curl -L "https://exemple.com/assets/highlight-flow.jpg" -o public/images/highlight-flow.jpg
curl -L "https://exemple.com/assets/highlight-honey.jpg" -o public/images/highlight-honey.jpg
curl -L "https://exemple.com/assets/highlight-visit.jpg" -o public/images/highlight-visit.jpg
curl -L "https://exemple.com/assets/honey-banner.jpg" -o public/images/honey-banner.jpg
```

## Variante : téléchargement en bloc via un manifest
Si vous disposez d’un manifest JSON listant les images à rapatrier, créez un fichier temporaire `images.json` contenant les couples `url`/`output` puis exécutez :

```bash
cat > /tmp/images.json <<'JSON'
[
  {"url": "https://exemple.com/assets/auth-illustration.jpg", "output": "public/images/auth-illustration.jpg"},
  {"url": "https://exemple.com/assets/hero.jpg", "output": "public/images/hero.jpg"},
  {"url": "https://exemple.com/assets/highlight-flow.jpg", "output": "public/images/highlight-flow.jpg"},
  {"url": "https://exemple.com/assets/highlight-honey.jpg", "output": "public/images/highlight-honey.jpg"},
  {"url": "https://exemple.com/assets/highlight-visit.jpg", "output": "public/images/highlight-visit.jpg"},
  {"url": "https://exemple.com/assets/honey-banner.jpg", "output": "public/images/honey-banner.jpg"}
]
JSON

jq -r '.[] | "curl -L \"" + .url + "\" -o " + .output' /tmp/images.json | bash
```

Cette approche permet de rejouer rapidement les téléchargements ou d’ajouter de nouveaux visuels en modifiant seulement le manifest.
