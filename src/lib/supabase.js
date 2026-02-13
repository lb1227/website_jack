const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

const buildHeaders = () => ({
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
});

const mapProfileRow = (row) => ({
  id: row.id,
  name: row.name,
  tags: row.tags,
  bio: row.bio,
  avatar: row.avatar,
  background: row.background,
  counts: {
    works: row.works_count,
    followers: row.followers_count,
    subscribers: row.subscribers_count,
    following: row.following_count,
  },
  works: Array.isArray(row.works)
    ? row.works.map((work) => ({
        title: work.title,
        cover: work.cover,
        status: work.status,
        detail: work.detail,
        link: work.link,
      }))
    : [],
});

export async function fetchCreatorProfileById(creatorId) {
  if (!isSupabaseConfigured || !creatorId) {
    return null;
  }

  const query = new URLSearchParams({
    id: `eq.${creatorId}`,
    select:
      "id,name,tags,bio,avatar,background,works_count,followers_count,subscribers_count,following_count,works",
    limit: "1",
  });

  const response = await fetch(`${SUPABASE_URL}/rest/v1/creator_profiles?${query.toString()}`, {
    headers: buildHeaders(),
  });

  if (!response.ok) {
    return null;
  }

  const rows = await response.json();
  if (!Array.isArray(rows) || rows.length === 0) {
    return null;
  }

  return mapProfileRow(rows[0]);
}
