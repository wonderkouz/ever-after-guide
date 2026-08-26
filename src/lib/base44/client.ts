import { createClient } from "@base44/sdk";

/**
 * Client Base44 — initialisé paresseusement, côté navigateur uniquement.
 *
 * Le SDK @base44/sdk communique avec le backend Base44 (https://base44.app) via des
 * appels HTTP. Le token d'authentification est stocké dans localStorage (clé
 * `base44_access_token`) : l'authentification est donc strictement côté client.
 * `createClient` est SSR-safe (il ne plante pas sur le serveur) mais les appels
 * authentifiés ne fonctionnent qu'avec un token présent — donc en navigateur.
 *
 * L'`appId` identifie votre app Base44 (public, trouvable dans l'URL de l'éditeur
 * Base44). Il est fourni via la variable d'environnement `VITE_BASE44_APP_ID`.
 */
type Base44Client = ReturnType<typeof createClient>;

let client: Base44Client | null = null;

export function getBase44(): Base44Client {
  if (!client) {
    const appId = import.meta.env.VITE_BASE44_APP_ID;
    if (!appId) {
      console.warn(
        "[base44] VITE_BASE44_APP_ID n'est pas défini — renseignez l'appId Base44 " +
          "(URL de l'éditeur Base44) via la variable d'environnement VITE_BASE44_APP_ID.",
      );
    }
    client = createClient({
      appId,
      options: {
        onError: (error: unknown) => {
          console.error("[base44]", error);
        },
      },
    });
  }
  return client;
}

export type { Base44Client };
