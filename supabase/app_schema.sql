-- Core Pensup schema for profiles, works, bookmarks, reading history, and follows.
-- Run in Supabase SQL editor.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  bio text,
  avatar_url text,
  banner_url text,
  links jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;



create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_username text;
begin
  base_username := nullif(split_part(new.email, '@', 1), '');

  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(base_username, 'user') || '_' || left(replace(new.id::text, '-', ''), 8),
    coalesce(base_username, 'New user')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user_profile();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

-- Works (posts/stories)
create table if not exists public.works (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  summary text,
  content jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists works_author_id_idx on public.works(author_id);
create index if not exists works_status_pub_idx on public.works(status, published_at desc);

alter table public.works enable row level security;

drop trigger if exists set_works_updated_at on public.works;
create trigger set_works_updated_at
before update on public.works
for each row
execute function public.set_updated_at();

-- Bookmarks (user-private)
create table if not exists public.bookmarks (
  user_id uuid not null references auth.users(id) on delete cascade,
  work_id uuid not null references public.works(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, work_id)
);

alter table public.bookmarks enable row level security;

-- Reading history (user-private)
create table if not exists public.reading_history (
  user_id uuid not null references auth.users(id) on delete cascade,
  work_id uuid not null references public.works(id) on delete cascade,
  last_read_at timestamptz not null default now(),
  progress numeric not null default 0 check (progress >= 0 and progress <= 1),
  primary key (user_id, work_id)
);

alter table public.reading_history enable row level security;

-- Follows
create table if not exists public.follows (
  user_id uuid not null references auth.users(id) on delete cascade,
  creator_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, creator_id)
);

alter table public.follows enable row level security;

-- RLS Policies

drop policy if exists "Public can read profiles" on public.profiles;
create policy "Public can read profiles"
on public.profiles for select
to public
using (true);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
on public.profiles for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Public can read published works" on public.works;
create policy "Public can read published works"
on public.works for select
to public
using (status = 'published');

drop policy if exists "Authors can read their own works" on public.works;
create policy "Authors can read their own works"
on public.works for select
to authenticated
using (auth.uid() = author_id);

drop policy if exists "Authors can create works" on public.works;
create policy "Authors can create works"
on public.works for insert
to authenticated
with check (auth.uid() = author_id);

drop policy if exists "Authors can update their own works" on public.works;
create policy "Authors can update their own works"
on public.works for update
to authenticated
using (auth.uid() = author_id)
with check (auth.uid() = author_id);

drop policy if exists "Authors can delete their own works" on public.works;
create policy "Authors can delete their own works"
on public.works for delete
to authenticated
using (auth.uid() = author_id);

drop policy if exists "Users can view their bookmarks" on public.bookmarks;
create policy "Users can view their bookmarks"
on public.bookmarks for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can add bookmarks" on public.bookmarks;
create policy "Users can add bookmarks"
on public.bookmarks for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can remove bookmarks" on public.bookmarks;
create policy "Users can remove bookmarks"
on public.bookmarks for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can view their reading history" on public.reading_history;
create policy "Users can view their reading history"
on public.reading_history for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert their reading history" on public.reading_history;
create policy "Users can insert their reading history"
on public.reading_history for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update their reading history" on public.reading_history;
create policy "Users can update their reading history"
on public.reading_history for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can view their follows" on public.follows;
create policy "Users can view their follows"
on public.follows for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can follow" on public.follows;
create policy "Users can follow"
on public.follows for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can unfollow" on public.follows;
create policy "Users can unfollow"
on public.follows for delete
to authenticated
using (auth.uid() = user_id);
