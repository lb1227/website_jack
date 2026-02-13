const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

const buildHeaders = (extraHeaders = {}) => ({
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
  ...extraHeaders,
});

const mapWorkRow = (work) => ({
  title: work.title,
  cover: "https://picsum.photos/seed/default-work-cover/160/160",
  status: work.status === "published" ? "Published" : work.status,
  detail: work.summary || "Published work",
  link: `/works/${work.id}`,
});

const countFromContentRange = (headerValue) => {
  if (!headerValue || !headerValue.includes("/")) {
    return 0;
  }
  const [, total] = headerValue.split("/");
  const parsed = Number.parseInt(total, 10);
  return Number.isFinite(parsed) ? parsed : 0;
};

const fetchCount = async (table, filters) => {
  const query = new URLSearchParams({ select: "*" });
  Object.entries(filters).forEach(([key, value]) => {
    query.set(key, `eq.${value}`);
  });

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query.toString()}`, {
    method: "HEAD",
    headers: buildHeaders({ Prefer: "count=exact" }),
  });

  if (!response.ok) {
    return 0;
  }

  return countFromContentRange(response.headers.get("content-range"));
};

export async function fetchCreatorProfileByUsername(username) {
  if (!isSupabaseConfigured || !username) {
    return null;
  }

  const profileQuery = new URLSearchParams({
    username: `eq.${username}`,
    select: "id,username,display_name,bio,avatar_url,banner_url",
    limit: "1",
  });

  const profileResponse = await fetch(`${SUPABASE_URL}/rest/v1/profiles?${profileQuery.toString()}`, {
    headers: buildHeaders(),
  });

  if (!profileResponse.ok) {
    return null;
  }

  const profiles = await profileResponse.json();
  if (!Array.isArray(profiles) || profiles.length === 0) {
    return null;
  }

  const profile = profiles[0];
  const worksQuery = new URLSearchParams({
    author_id: `eq.${profile.id}`,
    status: "eq.published",
    select: "id,title,summary,status,published_at",
    order: "published_at.desc",
    limit: "12",
  });

  const worksResponse = await fetch(`${SUPABASE_URL}/rest/v1/works?${worksQuery.toString()}`, {
    headers: buildHeaders(),
  });

  const works = worksResponse.ok ? await worksResponse.json() : [];
  const followers = await fetchCount("follows", { creator_id: profile.id });

  return {
    id: profile.username,
    name: profile.display_name || profile.username,
    tags: "Creator · Supabase profile",
    bio: profile.bio || "Nothing here yet:(",
    avatar: profile.avatar_url || "",
    background: profile.banner_url || "",
    counts: {
      works: Array.isArray(works) ? works.length : 0,
      followers,
      subscribers: 0,
      following: 0,
    },
    works: Array.isArray(works) ? works.map(mapWorkRow) : [],
  };
}
