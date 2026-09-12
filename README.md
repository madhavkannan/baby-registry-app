# Baby Registry

Private, single-user checklist for tracking baby registry items. Add items
under a category, mark a priority, and check them off once you've got them.
Everything is stored locally in the browser (localStorage) — no account, no
backend.

## Stack

React + Vite + Tailwind, plain static SPA.

## Develop

```sh
npm install
npm run dev
```

## Deploy (GitHub Pages)

```sh
npm run deploy
```

This builds the app and pushes `dist/` to the `gh-pages` branch via the
`gh-pages` package. GitHub Pages is configured to serve from that branch.

## Layout

- `src/data/` — types, category list, localStorage store
- `src/components/` — item row, add-item sheet
- `src/App.tsx` — single view: grouped checklist + add flow
