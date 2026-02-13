# Supabase setup (Pensup)

## 1) Environment variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

> Do not put your `service_role` key in frontend env files.

## 2) Create table

Run this SQL in the Supabase SQL editor:

```sql
create table if not exists public.creator_profiles (
  id text primary key,
  name text not null,
  tags text not null,
  bio text not null,
  avatar text not null,
  background text not null,
  works_count integer not null default 0,
  followers_count integer not null default 0,
  subscribers_count integer not null default 0,
  following_count integer not null default 0,
  works jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
```

## 3) Enable RLS + read policy

```sql
alter table public.creator_profiles enable row level security;

create policy "public can read creator profiles"
on public.creator_profiles
for select
using (true);
```

## 4) Seed data

Insert rows that match the shape in `src/data/creatorProfiles.js`.

## 5) Start app

```bash
npm run dev
```

Navigate to `#/creator/ariela-ross` etc.
The profile page will:
- use Supabase data first,
- and fallback to local mock data if no row exists or Supabase is unreachable.
