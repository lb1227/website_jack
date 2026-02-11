import React from "react";

const quickFilters = ["Trending now", "Romance", "Fantasy", "Sci-fi", "Thriller", "Completed"];

const curatedLists = [
  {
    title: "Late Night Mind-Benders",
    description: "Twisty psychological serials for 2am binge marathons.",
    count: "12 stories",
    vibe: "Dark intrigue",
    updated: "Updated 2h ago",
    followers: "4.8k followers",
    gradient: "list-theme-neon",
  },
  {
    title: "Slow Burn Romance",
    description: "Character-first arcs with long-build emotional payoffs.",
    count: "8 stories",
    vibe: "Soft drama",
    updated: "Updated yesterday",
    followers: "3.1k followers",
    gradient: "list-theme-rose",
  },
  {
    title: "Worldbuilding Gold",
    description: "Deep fantasy and sci-fi universes worth getting lost in.",
    count: "16 stories",
    vibe: "Epic scope",
    updated: "Updated 4h ago",
    followers: "7.2k followers",
    gradient: "list-theme-aurora",
  },
  {
    title: "Cozy Weekend Reads",
    description: "Warm slice-of-life picks for decompressing after a busy week.",
    count: "10 stories",
    vibe: "Comfort mode",
    updated: "Updated today",
    followers: "2.4k followers",
    gradient: "list-theme-sunset",
  },
];

export default function Lists() {
  return (
    <main className="page-shell">
      <section className="hero hero-lists">
        <div className="hero-content">
          <span className="pill">Your Lists</span>
          <p className="hero-copy">
            Organize by mood, track what&apos;s hot, and jump right back into the perfect read.
          </p>
          <div className="lists-hero-metrics" aria-label="Collection overview">
            <article>
              <strong>34</strong>
              <span>Total stories saved</span>
            </article>
            <article>
              <strong>4</strong>
              <span>Active collections</span>
            </article>
            <article>
              <strong>17k+</strong>
              <span>Combined followers</span>
            </article>
          </div>
          <div className="lists-filter-row" aria-label="List filters">
            {quickFilters.map((filter) => (
              <button key={filter} type="button" className="lists-filter-chip">
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section utility-page-section lists-page-section">
        <aside className="lists-sidebar" aria-label="Lists stats and shortcuts">
          <h2>Your Collection</h2>
          <div className="lists-sidebar-stats">
            <article>
              <span>Most followed</span>
              <strong>Worldbuilding Gold</strong>
            </article>
            <article>
              <span>Fastest growing</span>
              <strong>Late Night Mind-Benders</strong>
            </article>
            <article>
              <span>Unread queue</span>
              <strong>9 chapters waiting</strong>
            </article>
          </div>
          <button type="button" className="outline-button">
            + Create new list
          </button>
        </aside>

        <div>
          <div className="lists-header-row">
            <h2>Saved collections</h2>
            <button type="button" className="text-button">
              Manage all
            </button>
          </div>
          <div className="list-grid">
            {curatedLists.map((list) => (
              <article className={`list-card ${list.gradient}`} key={list.title}>
                <header>
                  <span className="list-card-pill">{list.vibe}</span>
                  <small>{list.updated}</small>
                </header>
                <div className="list-card-body">
                  <h3>{list.title}</h3>
                  <p>{list.description}</p>
                </div>
                <footer>
                  <div>
                    <strong>{list.count}</strong>
                    <small>{list.followers}</small>
                  </div>
                  <button type="button" className="list-card-link" aria-label={`Open ${list.title}`}>
                    Open →
                  </button>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
