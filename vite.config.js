import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    // C'est ici que l'on ajoute les hôtes autorisés pour la prévisualisation/déploiement
    allowedHosts: [
      'mon-rucher.onrender.com', // ⬅️ AJOUTEZ VOTRE DOMAINE RENDER ICI
      // Vous pouvez ajouter d'autres domaines si nécessaire, ex: 'localhost'
    ],
  }
});
