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

<!-- BASE44:BEGIN -->
## Base44 dev environment (sandbox preview)

Run the app from source with the live-reload Vite dev server on host port 3000:

```sh
docker compose -f docker-compose.base44.yml up -d
docker compose -f docker-compose.base44.yml logs -f web
```

Non-obvious things that make a fresh checkout/import look like it "failed to start":

- **The dev server must be forced onto port 3000.** `@lovable.dev/vite-tanstack-config`
  defaults the dev server to port **8080** (host `::`) unless it detects a Lovable
  sandbox, and the preview only reads host port 3000 — so a bare `bun run dev` serves
  nothing anybody can see. `docker-compose.base44.yml` therefore starts Vite with
  `--host 0.0.0.0 --port 3000`; any other start path needs the same flags.
- **Vite's host gate needs the platform's allowed-host value.** The preview reaches the
  server as `<port>-<sandbox id>.$BASE44_SANDBOX_HOST_DOMAIN` and Vite answers
  403 `Blocked request. This host is not allowed.` unless
  `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` (supplied by the platform) is in the process
  environment. The compose service passes it through as a bare key; never hardcode a
  resolved host value, the sandbox id rotates.
- **Dependencies come from `bun.lock`, not npm.** `node_modules` lives on the
  bind-mounted source tree, so the install runs at container start
  (`bun install --frozen-lockfile`) rather than in the image. The README's `npm i`
  would resolve fresh versions instead of the pinned lockfile.
- **No environment variables or secrets are needed.** All state (wedding, guests,
  vendors, moodboards) lives in the browser's localStorage; there is no server
  database and no code reads `import.meta.env`/`process.env`. The platform secret
  `VITE_BASE44_APP_ID` is unused by this app.
- **`src/routeTree.gen.ts` is generated** from `src/routes/*.tsx` by the TanStack
  Router plugin. Route files and that generated file have to agree — a route file
  without its entry (or a merge that resolves the two sides differently) breaks
  routing. Do not hand-edit it: start the dev server and let the plugin rewrite it.

### Verifying a change

- Shell: `curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/invites`
  (server-rendered HTML, one line per route).
- Browser: the app is a single client-side app after hydration; navigate with the
  app's own header links. Synthetic `history.pushState` alone does not make the
  TanStack Router re-render.
- Build / type-free production check inside the container:
  `docker compose -f docker-compose.base44.yml exec -T web sh -ec 'bun run build'`
  (`bun run lint` for ESLint). There is no test suite in this repo.
<!-- BASE44:END -->
