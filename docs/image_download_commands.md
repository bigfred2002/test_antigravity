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

# Télécharger les illustrations (sources libres Unsplash)
curl -L "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80" -o public/images/auth-illustration.jpg
curl -L "https://images.unsplash.com/photo-1522755967827-0d85e1d93c74?auto=format&fit=crop&w=1400&q=80" -o public/images/hero.jpg
curl -L "https://images.unsplash.com/photo-1464660756002-dd9f9a92b01c?auto=format&fit=crop&w=1200&q=80" -o public/images/highlight-flow.jpg
curl -L "https://images.unsplash.com/photo-1515162305281-743ed8aef5cc?auto=format&fit=crop&w=1200&q=80" -o public/images/highlight-honey.jpg
curl -L "https://images.unsplash.com/photo-1441123100240-f9f3f77ed41b?auto=format&fit=crop&w=1200&q=80" -o public/images/highlight-visit.jpg
curl -L "https://images.unsplash.com/photo-1508175769321-41a6d7acd1f6?auto=format&fit=crop&w=1400&q=80" -o public/images/honey-banner.jpg
```

## Variante : téléchargement en bloc via un manifest
Si vous disposez d’un manifest JSON listant les images à rapatrier, créez un fichier temporaire `images.json` contenant les couples `url`/`output` puis exécutez :

```bash
cat > /tmp/images.json <<'JSON'
[
  {"url": "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80", "output": "public/images/auth-illustration.jpg"},
  {"url": "https://images.unsplash.com/photo-1522755967827-0d85e1d93c74?auto=format&fit=crop&w=1400&q=80", "output": "public/images/hero.jpg"},
  {"url": "https://images.unsplash.com/photo-1464660756002-dd9f9a92b01c?auto=format&fit=crop&w=1200&q=80", "output": "public/images/highlight-flow.jpg"},
  {"url": "https://images.unsplash.com/photo-1515162305281-743ed8aef5cc?auto=format&fit=crop&w=1200&q=80", "output": "public/images/highlight-honey.jpg"},
  {"url": "https://images.unsplash.com/photo-1441123100240-f9f3f77ed41b?auto=format&fit=crop&w=1200&q=80", "output": "public/images/highlight-visit.jpg"},
  {"url": "https://images.unsplash.com/photo-1508175769321-41a6d7acd1f6?auto=format&fit=crop&w=1400&q=80", "output": "public/images/honey-banner.jpg"}
]
JSON

jq -r '.[] | "curl -L \"" + .url + "\" -o " + .output' /tmp/images.json | bash
```

Cette approche permet de rejouer rapidement les téléchargements ou d’ajouter de nouveaux visuels en modifiant seulement le manifest.
