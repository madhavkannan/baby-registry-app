# Supabase backend setup

The app works standalone (localStorage) without this, but sharing the list
across two devices needs it. This reuses the **same Supabase project as the
pregnancy app** — just two new tables — so if that project already exists
there's no new account or project to create.

## 1. Run the migration

In the Supabase dashboard for that project → SQL Editor → run
[`migrations/0001_registry.sql`](migrations/0001_registry.sql). Creates
`registry_item` and `registry_meta`, open to the anon key (same open-RLS
pattern the pregnancy app already uses).

## 2. Point the frontend at Supabase

Copy `.env.example` to `.env` and fill in the same `VITE_SUPABASE_URL` /
`VITE_SUPABASE_ANON_KEY` values already used by the pregnancy app's `.env`.
Rebuild and redeploy (`npm run deploy`). The app switches from localStorage
to Supabase automatically when these are present. (Anything already in
localStorage stays on that device only; the shared list starts empty.)
