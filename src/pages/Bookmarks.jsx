import React from "react";

const bookmarkFilters = ["Recently saved", "Continue reading", "Highlights", "Offline ready", "Downloaded"];

const bookmarkedStories = [
  {
    title: "Glass Harbor",
    detail: "Chapter 17 • saved 3 hours ago",
    note: "Pinned for tonight's read",
    progress: "72% complete",
    estimate: "18 min left",
    tone: "bookmark-theme-cobalt",
  },
  {
    title: "Neon Orchard",
    detail: "Chapter 6 • saved yesterday",
    note: "Marked after the rooftop reveal",
    progress: "31% complete",
    estimate: "42 min left",
    tone: "bookmark-theme-rose",
  },
  {
    title: "The Fifth Gate",
    detail: "Chapter 28 • saved 2 days ago",
    note: "Lore notes attached",
    progress: "89% complete",
    estimate: "11 min left",
    tone: "bookmark-theme-aurora",
  },
  {
    title: "Midnight Relay",
    detail: "Chapter 9 • saved this morning",
    note: "Saved from creator livestream",
    progress: "54% complete",
    estimate: "27 min left",
    tone: "bookmark-theme-sunset",
  },
];

export default function Bookmarks() {
  return (
    <main className="page-shell">
      <section className="hero hero-bookmarks">
        <div className="hero-content">
          <span className="pill">Bookmarks</span>
          <h1>Pick up exactly where you left off</h1>
          <p className="hero-copy">
            Keep every cliffhanger, note, and highlight in one polished queue across all your devices.
          </p>
          <div className="bookmark-hero-metrics" aria-label="Bookmark stats">
            <article>
              <strong>26</strong>
              <span>Stories in progress</span>
            </article>
            <article>
              <strong>113</strong>
              <span>Saved highlights</span>
            </article>
            <article>
              <strong>7h 20m</strong>
              <span>Estimated reading left</span>
            </article>
          </div>
          <div className="bookmark-filter-row" aria-label="Bookmark filters">
            {bookmarkFilters.map((filter) => (
              <button key={filter} type="button" className="bookmark-filter-chip">
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section utility-page-section bookmarks-page-section">
        <aside className="bookmarks-sidebar" aria-label="Bookmark shortcuts">
          <h2>Reading control</h2>
          <p>Jump to unfinished chapters, revisit annotations, and queue offline packs in one tap.</p>
          <div className="bookmarks-sidebar-stats">
            <article>
              <span>Most revisited</span>
              <strong>Glass Harbor</strong>
            </article>
            <article>
              <span>Longest streak</span>
              <strong>9 nights in a row</strong>
            </article>
            <article>
              <span>Offline downloads</span>
              <strong>14 chapters cached</strong>
            </article>
          </div>
          <button type="button" className="outline-button">
            + Save current chapter
          </button>
        </aside>

        <div>
          <div className="lists-header-row">
            <h2>Recent bookmarks</h2>
            <button type="button" className="text-button">
              Manage archive
            </button>
          </div>

          <div className="bookmark-list">
            {bookmarkedStories.map((story) => (
              <article className={`bookmark-card bookmark-enhanced-card ${story.tone}`} key={story.title}>
                <header>
                  <span className="list-card-pill">{story.progress}</span>
                  <small>{story.detail}</small>
                </header>
                <div className="bookmark-card-body">
                  <h3>{story.title}</h3>
                  <p>{story.note}</p>
                </div>
                <footer>
                  <div>
                    <strong>{story.estimate}</strong>
                    <small>Reading estimate</small>
                  </div>
                  <button type="button" className="list-card-link" aria-label={`Continue ${story.title}`}>
                    Continue →
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
