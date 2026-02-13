-- Pensup creator profile table + public read policy + seed rows

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

alter table public.creator_profiles enable row level security;

drop policy if exists "public can read creator profiles" on public.creator_profiles;
create policy "public can read creator profiles"
on public.creator_profiles
for select
using (true);

insert into public.creator_profiles (
  id, name, tags, bio, avatar, background,
  works_count, followers_count, subscribers_count, following_count, works
)
values
  (
    'ariela-ross',
    'Ariela Ross',
    'Epic fantasy · Mythic retellings · Serial fiction',
    'Ariela writes long-form fantasy that leans on lyrical prose, sweeping battles, and slow-burn alliances. She hosts weekly craft notes and annotated chapter drops.',
    'https://picsum.photos/seed/ariela-ross/200/200',
    'https://picsum.photos/seed/ariela-ross-bg/1600/900',
    3, 18240, 5120, 21,
    '[
      {"title":"Rhapsody of Ember","cover":"https://picsum.photos/seed/ember-works/160/160","status":"Ongoing","detail":"12 chapters · 9.6 rating","link":"/works/rhapsody-of-ember"},
      {"title":"The Glass Orchard","cover":"https://picsum.photos/seed/glass-orchard/160/160","status":"New release","detail":"4 chapters · 9.3 rating","link":"/works/the-glass-orchard"},
      {"title":"Mythic Rewrites","cover":"https://picsum.photos/seed/mythic-rewrites/160/160","status":"Season 2","detail":"14 chapters · 9.2 rating","link":"/works/mythic-rewrites"}
    ]'::jsonb
  ),
  (
    'marcos-lune',
    'Marcos Lune',
    'Coastal drama · Character studies · Reader polls',
    'Marcos builds layered coastal dramas with interactive reader polls and live afterword salons. He shares behind-the-scenes location audio with subscribers.',
    'https://picsum.photos/seed/marcos-lune/200/200',
    'https://picsum.photos/seed/marcos-lune-bg/1600/900',
    2, 14350, 3890, 18,
    '[
      {"title":"Harborlight","cover":"https://picsum.photos/seed/harborlight/160/160","status":"Ongoing","detail":"18 chapters · 9.4 rating","link":"/works/harborlight"},
      {"title":"Low Tide Legends","cover":"https://picsum.photos/seed/low-tide-legends/160/160","status":"Complete","detail":"10 chapters · 9.1 rating","link":"/works/low-tide-legends"}
    ]'::jsonb
  ),
  (
    'sanaa-bell',
    'Sanaa Bell',
    'Sci-fi noir · Interactive dossiers · Tech mystery',
    'Sanaa blends neon noir with investigative storytelling, layering interactive dossiers and reader-submitted clues into each arc.',
    'https://picsum.photos/seed/sanaa-bell/200/200',
    'https://picsum.photos/seed/sanaa-bell-bg/1600/900',
    4, 20110, 6100, 33,
    '[
      {"title":"Neon Caravan","cover":"https://picsum.photos/seed/neon-caravan/160/160","status":"Season 1","detail":"10 chapters · 9.3 rating","link":"/works/neon-caravan"},
      {"title":"Inkbound Circuit","cover":"https://picsum.photos/seed/inkbound-circuit/160/160","status":"Prelaunch","detail":"Trailer · 2 previews","link":"/works/inkbound-circuit"},
      {"title":"Starlit Syntax","cover":"https://picsum.photos/seed/starlit-syntax/160/160","status":"Complete","detail":"12 chapters · 9.0 rating","link":"/works/starlit-syntax"}
    ]'::jsonb
  ),
  (
    'elyse-hart',
    'Elyse Hart',
    'Mystery · Found documents · Reader sleuths',
    'Elyse curates puzzle-forward mysteries with community sleuthing nights and hidden artifact drops for subscribers.',
    'https://picsum.photos/seed/elyse-hart/200/200',
    'https://picsum.photos/seed/elyse-hart-bg/1600/900',
    2, 12680, 2740, 27,
    '[
      {"title":"The Silent Archive","cover":"https://picsum.photos/seed/silent-archive/160/160","status":"Ongoing","detail":"8 chapters · 9.1 rating","link":"/works/the-silent-archive"},
      {"title":"Frames of the Fallen","cover":"https://picsum.photos/seed/frames-fallen/160/160","status":"Complete","detail":"11 chapters · 8.9 rating","link":"/works/frames-of-the-fallen"}
    ]'::jsonb
  )
on conflict (id) do update
set
  name = excluded.name,
  tags = excluded.tags,
  bio = excluded.bio,
  avatar = excluded.avatar,
  background = excluded.background,
  works_count = excluded.works_count,
  followers_count = excluded.followers_count,
  subscribers_count = excluded.subscribers_count,
  following_count = excluded.following_count,
  works = excluded.works;
