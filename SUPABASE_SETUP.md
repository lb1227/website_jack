# Supabase backend setup (Pensup)

## 1) Environment variables

Create `.env.local` in project root:

```env
VITE_SUPABASE_URL=https://kqplmxnskmozyshgmxjs.supabase.co
VITE_SUPABASE_ANON_KEY=...
```

Get anon key from **Supabase Dashboard → Project Settings → API**.

> Never put `service_role` keys in frontend env files.

## 2) Apply schema + RLS policies

Run this SQL file in Supabase SQL editor:

- `supabase/app_schema.sql`

This creates:
- `public.profiles`
- `public.works`
- `public.bookmarks`
- `public.reading_history`
- `public.follows`

It also enables RLS and applies policies for public read / owner-only writes.

## 3) Route design

Use creator username routes:

- `/creator/:username`

The app resolves:
- profile from `public.profiles` by `username`
- creator works from `public.works` by `author_id` with `status='published'`

## 4) Publishing logic

To publish from client, update your work row:
- `status = 'published'`
- `published_at = now()`

RLS protects this so only the author can update their own works.

## 5) Legacy file

- `supabase/creator_profiles.sql` is kept only for the earlier denormalized prototype.
- Prefer `supabase/app_schema.sql` for all new setup.
