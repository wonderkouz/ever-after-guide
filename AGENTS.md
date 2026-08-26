<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Base44 dev environment

This is a TanStack Start (SSR) + React 19 + Vite app scaffolded by Lovable. It
uses **Bun** as its package manager (`bun.lock`, `bunfig.toml`).

### Run it

```sh
docker compose -f docker-compose.base44.yml up -d
```

- The web service runs `bun install` then `bun run dev` (Vite dev server) with
  `--host 0.0.0.0 --port 3000`, so the preview is served on host port 3000.
- Source is bind-mounted at `/app`; an anonymous volume keeps `/app/node_modules`
  separate from the host so the install isn't shadowed.
- No external secrets or backend services are required — the app is frontend-only
  with in-memory/local state. There is no database.

### Notes / quirks

- `vite.config.ts` relies on `@lovable.dev/vite-tanstack-config`, which bundles
  the TanStack Start, React, Tailwind, and nitro plugins. Do NOT re-add those
  plugins manually — it breaks the build with duplicates.
- TanStack Start uses SSR (nitro). The custom server entry lives in
  `src/server.ts` (an SSR error wrapper). Routes live in `src/routes/`.
- `bunfig.toml` enforces a 24h supply-chain guard (`minimumReleaseAge`) with a
  few Lovable packages excluded. If a fresh dependency fails to install, it is
  likely because it was published less than 24h ago.
- Verify the app is live: `curl -sf -H "Host: external-preview.example.com" http://localhost:3000/`
  should return the Wedly landing page HTML.

## Base44 backend (SDK @base44/sdk)

The app uses Base44 as its backend (auth + database + entities + permissions) via the
official `@base44/sdk`. This is an **external app** integration (the app is NOT built
on the Base44 platform; it's a TanStack Start app that talks to Base44's managed backend).

### Wiring

- `@base44/sdk` is installed (`package.json`). The SDK talks to `https://base44.app`
  over HTTP and stores the auth token in `localStorage` (key `base44_access_token`).
  **Auth is client-side only** — the SDK is SSR-safe (`createClient` guards `window`),
  but the token lives in the browser, so auth state is resolved in a `useEffect`
  (not during SSR), matching the app's existing client-side pattern.
- `src/lib/base44/client.ts` — lazy singleton `getBase44()` returning the Base44 client,
  initialized with `appId` from `import.meta.env.VITE_BASE44_APP_ID`. Created lazily
  (client-side only) to avoid SSR-side network calls.
- `src/lib/base44/auth.tsx` — `Base44AuthProvider` + `useBase44Auth()` exposing
  `user`, `loading`, `isAuthenticated`, `login()`, `register()`, `logout()`. Wired into
  `__root.tsx` RootComponent (wraps `WeddingProvider`). The existing pages are unchanged.
- **appId**: `VITE_BASE44_APP_ID` (public Base44 app identifier) — provided via the
  platform-managed env file (`/run/base44/app.env`), loaded by compose `env_file`
  (with `.env.base44-defaults` as the empty placeholder). Vite's `loadEnv` (via the
  Lovable config) injects it into `import.meta.env.VITE_BASE44_APP_ID`.

### Entity access (next step — entities must be created in the Base44 dashboard)

```ts
import { getBase44 } from "@/lib/base44/client";
const base44 = getBase44();
const weddings = await base44.entities.Wedding.list();   // CRUD via base44.entities.<Name>
```

Entities (`Wedding`, `Task`, …) and their permissions (owner/auth) are defined in the
**Base44 dashboard** (Data → entities), not in code. The SDK reads them at runtime.

### Auth flow (native Base44)

- `base44.auth.loginViaEmailPassword(email, password)` → sets token (localStorage) + returns user.
- `base44.auth.me()` → current user (GET `/apps/<appId>/entities/User/me`).
- `base44.auth.register({ email, password, full_name })` → creates a user (then login).
- `base44.auth.logout()` → removes token + redirects to Base44 logout endpoint.

### Verify the connection

```sh
# appId present in the running container (don't print the value):
docker compose -f docker-compose.base44.yml exec -T web sh -c 'printenv VITE_BASE44_APP_ID >/dev/null && echo present || echo missing'
```
