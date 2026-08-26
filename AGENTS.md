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
