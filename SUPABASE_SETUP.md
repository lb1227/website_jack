# Supabase setup (Pensup)

## 1) Environment variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=https://kqplmxnskmozyshgmxjs.supabase.co
VITE_SUPABASE_ANON_KEY=...
```

Get the anon key from **Supabase Dashboard → Project Settings → API**.

> Do not put your `service_role` key in frontend env files.

## 2) Create schema + policy + seed creators

Run `supabase/creator_profiles.sql` in the Supabase SQL editor.

This script:
- creates `public.creator_profiles`
- enables RLS
- adds a public read policy
- inserts/upserts the starter creator rows used by the app

## 3) Start app

```bash
npm run dev
```

Navigate to `#/creator/ariela-ross` etc.
The profile page will:
- use Supabase data first,
- and fallback to local mock data if no row exists or Supabase is unreachable.

## 4) Security follow-up (recommended)

- Rotate any keys that were exposed in chat/history.
- Keep frontend on anon key only.
- Reserve `service_role` for server-side functions only.
