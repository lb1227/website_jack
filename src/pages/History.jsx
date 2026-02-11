import React from "react";

const historyFilters = ["All activity", "Reading progress", "Likes", "Follows", "Notes"];

const timelineEntries = [
  {
    title: "Finished Chapter 9 of Rhapsody of Ember",
    detail: "2 hours ago • Reading progress",
    context: "You unlocked a bonus creator note and queued Chapter 10.",
    impact: "+14 streak points",
    tone: "history-theme-ember",
  },
  {
    title: "Liked Episode 4 of Iron Bloom",
    detail: "Yesterday • Engagement",
    context: "Your like helped push Iron Bloom into this week&apos;s Rising picks.",
    impact: "Creator notified",
    tone: "history-theme-rose",
  },
  {
    title: "Started reading The Hollow Atlas",
    detail: "2 days ago • New follow",
    context: "Added to your Late Night Mind-Benders list for easier catch-up.",
    impact: "3 chapters queued",
    tone: "history-theme-aurora",
  },
  {
    title: "Followed creator Nia Mercer",
    detail: "This week • Creator activity",
    context: "You&apos;ll now get release alerts and livestream reminders.",
    impact: "Weekly digest enabled",
    tone: "history-theme-sunset",
  },
];

export default function History() {
  return (
    <main className="page-shell">
      <section className="hero hero-history">
        <div className="hero-content">
          <span className="pill">History</span>
          <h1>Your recent activity timeline</h1>
          <p className="hero-copy">
            Revisit everything you&apos;ve read, liked, and followed with a polished event feed that keeps your recommendations in sync.
          </p>
          <div className="history-hero-metrics" aria-label="History summary stats">
            <article>
              <strong>47</strong>
              <span>Actions this week</span>
            </article>
            <article>
              <strong>12</strong>
              <span>Creators engaged</span>
            </article>
            <article>
              <strong>6h 10m</strong>
              <span>Reading time tracked</span>
            </article>
          </div>
          <div className="history-filter-row" aria-label="History filters">
            {historyFilters.map((filter) => (
              <button key={filter} type="button" className="history-filter-chip">
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section utility-page-section history-page-section">
        <aside className="history-sidebar" aria-label="History insights">
          <h2>Activity insights</h2>
          <p>Spot your reading habits, revisit key moments, and tune what appears in your personalized feed.</p>
          <div className="history-sidebar-stats">
            <article>
              <span>Most active day</span>
              <strong>Thursday nights</strong>
            </article>
            <article>
              <span>Top genre this month</span>
              <strong>Fantasy mystery</strong>
            </article>
            <article>
              <span>Saved highlights</span>
              <strong>28 quick notes</strong>
            </article>
          </div>
          <button type="button" className="outline-button">
            Export timeline
          </button>
        </aside>

        <div>
          <div className="lists-header-row">
            <h2>Recent actions</h2>
            <button type="button" className="text-button">
              Manage tracking
            </button>
          </div>
          <div className="history-timeline-grid">
            {timelineEntries.map((entry) => (
              <article className={`history-card ${entry.tone}`} key={entry.title}>
                <header>
                  <span className="list-card-pill">{entry.impact}</span>
                  <small>{entry.detail}</small>
                </header>
                <div className="list-card-body">
                  <h3>{entry.title}</h3>
                  <p>{entry.context}</p>
                </div>
                <footer>
                  <div>
                    <strong>View details</strong>
                    <small>Open activity log</small>
                  </div>
                  <button type="button" className="list-card-link" aria-label={`Open details for ${entry.title}`}>
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
