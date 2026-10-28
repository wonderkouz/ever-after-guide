// Config de build pour l'hébergement statique Base44 (`base44 site deploy`).
//
// Le mode SPA n'est appliqué QU'AU BUILD : le serveur de dev TanStack Start ne le
// supporte pas (avec `spa.enabled`, `vite dev` accepte la connexion mais ne répond
// plus). Le preview local utilise donc toujours `vite.config.ts` (SSR).
//
// Le build génère ./dist/client/index.html + ./dist/client/assets, qui sont les
// fichiers déployés (voir `site.outputDirectory` dans base44/config.jsonc).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    server: { allowedHosts: true, host: true },
  },
  tanstackStart: {
    spa: {
      enabled: true,
      // Nom du shell SPA : Base44 sert toutes les routes depuis index.html.
      prerender: { outputPath: "/index.html" },
    },
  },
  // Aucun serveur dans un build SPA : on désactive nitro.
  nitro: false,
});
