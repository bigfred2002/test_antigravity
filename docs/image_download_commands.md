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

# Télécharger les illustrations (sources libres apiculteur.ch)
curl -L "https://static.wixstatic.com/media/14438f_6ab004a09f95477583bdc96636fa3e0a~mv2.jpg" -o public/images/auth-illustration.jpg
curl -L "https://static.wixstatic.com/media/14438f_45fe16a1ebb64e96982f7e9b8c7fce54~mv2.jpg" -o public/images/hero.jpg
curl -L "https://static.wixstatic.com/media/14438f_cb5f4ad2ba9246f3adbba0eaabc24fad~mv2.jpg" -o public/images/highlight-flow.jpg
curl -L "https://static.wixstatic.com/media/14438f_60f3b7ffc3d2456e9146020f31e4e431~mv2.jpg" -o public/images/highlight-honey.jpg
curl -L "https://static.wixstatic.com/media/14438f_9d68368717514d519055973481c9ae91~mv2.jpg" -o public/images/highlight-visit.jpg
curl -L "https://static.wixstatic.com/media/14438f_b8e7ace04f784a84afa0106848602bd8~mv2.jpg" -o public/images/honey-banner.jpg
```

## Variante : téléchargement en bloc via un manifest
Si vous disposez d’un manifest JSON listant les images à rapatrier, créez un fichier temporaire `images.json` contenant les couples `url`/`output` puis exécutez :

```bash
cat > /tmp/images.json <<'JSON'
[
  {"url": "https://static.wixstatic.com/media/14438f_6ab004a09f95477583bdc96636fa3e0a~mv2.jpg", "output": "public/images/auth-illustration.jpg"},
  {"url": "https://static.wixstatic.com/media/14438f_45fe16a1ebb64e96982f7e9b8c7fce54~mv2.jpg", "output": "public/images/hero.jpg"},
  {"url": "https://static.wixstatic.com/media/14438f_cb5f4ad2ba9246f3adbba0eaabc24fad~mv2.jpg", "output": "public/images/highlight-flow.jpg"},
  {"url": "https://static.wixstatic.com/media/14438f_60f3b7ffc3d2456e9146020f31e4e431~mv2.jpg", "output": "public/images/highlight-honey.jpg"},
  {"url": "https://static.wixstatic.com/media/14438f_9d68368717514d519055973481c9ae91~mv2.jpg", "output": "public/images/highlight-visit.jpg"},
  {"url": "https://static.wixstatic.com/media/14438f_b8e7ace04f784a84afa0106848602bd8~mv2.jpg", "output": "public/images/honey-banner.jpg"}
]
JSON

jq -r '.[] | "curl -L \"" + .url + "\" -o " + .output' /tmp/images.json | bash
```

Cette approche permet de rejouer rapidement les téléchargements ou d’ajouter de nouveaux visuels en modifiant seulement le manifest.
