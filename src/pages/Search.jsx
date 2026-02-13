import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CREATOR_PROFILES } from "../data/creatorProfiles.js";

const SEARCH_INDEX = [
  { id: "story-1", type: "Story", name: "Harborlight", href: "/reading" },
  { id: "story-2", type: "Story", name: "Neon Caravan", href: "/reading" },
  { id: "story-3", type: "Story", name: "The Silent Archive", href: "/reading" },
  { id: "story-4", type: "Story", name: "Mythic Rewrites", href: "/reading" },
  ...CREATOR_PROFILES.map((creator) => ({
    id: `creator-${creator.id}`,
    type: "Creator",
    name: creator.name,
    href: `/creator/${creator.id}`,
  })),
];

export default function Search() {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!normalizedQuery) return SEARCH_INDEX;
    return SEARCH_INDEX.filter((entry) => entry.name.toLowerCase().includes(normalizedQuery));
  }, [normalizedQuery]);

  return (
    <main className="search-page">
      <section className="search-page-hero">
        <h1>Search PensUp</h1>
        <p>Find stories and creators fast.</p>
      </section>

      <label className="search-page-input-wrap" htmlFor="global-search-input">
        <span className="sr-only">Search stories and creators</span>
        <input
          id="global-search-input"
          type="search"
          placeholder="Search for a story or creator"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>

      <p className="search-page-status">
        {results.length} result{results.length === 1 ? "" : "s"}
        {normalizedQuery ? ` for \"${query}\"` : ""}
      </p>

      <div className="search-page-results">
        {results.map((result) => (
          <Link key={result.id} className="search-page-result-card" to={result.href}>
            <span className="search-result-type">{result.type}</span>
            <strong>{result.name}</strong>
          </Link>
        ))}
      </div>
    </main>
  );
}
