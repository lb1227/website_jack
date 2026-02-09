import React from "react";

export default function Profile() {
  return (
    <main className="page-shell profile-page">
      <section className="profile-hero" id="profile">
        <div className="profile-hero-card">
          <button className="profile-avatar is-editable" type="button" aria-label="Update avatar">
            <img
              src="https://picsum.photos/seed/creator-avery/240/240"
              alt="Avery Harper profile avatar"
            />
          </button>
          <div className="profile-summary">
            <p className="profile-summary-tags">Epic Fantasy • Cozy Mystery • Weekly Drops</p>
            <h1 className="profile-summary-name">Avery Harper</h1>
            <p className="profile-summary-bio">
              Building cozy worlds with high stakes. Currently drafting book three of Rhapsody of
              Ember and hosting live annotation sessions every Thursday.
            </p>
          </div>
          <div className="profile-counts">
            <div>
              <strong>12.4k</strong> Followers
            </div>
            <div>
              <strong>3</strong> Active Series
            </div>
            <div>
              <strong>96%</strong> Positive Ratings
            </div>
          </div>
          <div className="profile-actions">
            <button className="btn follow" type="button">
              + Follow
            </button>
            <button className="btn ghost" type="button">
              Message
            </button>
            <button className="icon-btn" type="button" aria-label="Share profile">
              ↗
            </button>
          </div>
          <p className="profile-status">
            Last updated 2 hours ago • Available for collaborations
          </p>
          <a className="profile-link" href="#">
            View public profile preview
          </a>
        </div>
      </section>

      <section className="profile-grid" aria-label="Profile highlights">
        <article className="settings-card">
          <h2>Creator Tier</h2>
          <p className="hero-subtitle">Spotlight</p>
          <p className="hero-copy">
            Featured across the homepage and recommended to new readers in fantasy and mystery.
          </p>
        </article>
        <article className="settings-card">
          <h2>Next Release</h2>
          <p className="hero-subtitle">Chapter 14 • Friday</p>
          <p className="hero-copy">
            Schedule automation is on. Patrons receive early access 24 hours before launch.
          </p>
        </article>
        <article className="settings-card">
          <h2>Monetization</h2>
          <p className="hero-subtitle">$2.9k this month</p>
          <p className="hero-copy">
            Premium arcs and signed bundles are performing above forecast for Q4.
          </p>
        </article>
      </section>

      <section className="profile-series">
        <div className="section-header">
          <div>
            <h2>Active Series</h2>
            <p className="hero-subtitle">Keep momentum with scheduled drops.</p>
          </div>
          <button className="btn ghost" type="button">
            Manage Series
          </button>
        </div>
        <div className="series-grid">
          {[
            {
              title: "Rhapsody of Ember",
              meta: "Epic Fantasy • 12 chapters",
              image: "https://picsum.photos/seed/rhapsody-ember-profile/120/120",
            },
            {
              title: "Lanterns of Liora",
              meta: "Cozy Mystery • 8 chapters",
              image: "https://picsum.photos/seed/lanterns-liora/120/120",
            },
            {
              title: "Starlit Syntax",
              meta: "Sci-Fi Romance • 6 chapters",
              image: "https://picsum.photos/seed/starlit-syntax-profile/120/120",
            },
          ].map((series) => (
            <article className="series-card" key={series.title}>
              <img src={series.image} alt={series.title} />
              <div>
                <p className="series-meta">{series.meta}</p>
                <strong>{series.title}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="profile-feed">
        <div className="section-header">
          <div>
            <h2>Creator Feed</h2>
            <p className="hero-subtitle">Highlights from your community.</p>
          </div>
          <button className="btn ghost" type="button">
            View Insights
          </button>
        </div>
        {[
          {
            title: "Reader note of the week",
            body:
              "“Every new chapter leaves me breathless. The cliffhanger pacing is perfection.”",
            author: "Elena P.",
            role: "Top supporter",
            image: "https://picsum.photos/seed/reader-elana/120/120",
            cover: "https://picsum.photos/seed/ember-feed/640/480",
          },
          {
            title: "Live session recap",
            body:
              "You hosted a 45-minute live annotation and gained 183 new followers afterward.",
            author: "PensUp Analytics",
            role: "Weekly recap",
            image: "https://picsum.photos/seed/analytics-avatar/120/120",
            cover: "https://picsum.photos/seed/live-session/640/480",
          },
        ].map((post) => (
          <article className="feed-card" key={post.title}>
            <div className="feed-media">
              <img src={post.cover} alt={post.title} />
            </div>
            <div className="feed-body">
              <div className="feed-author">
                <img src={post.image} alt={post.author} />
                <div>
                  <strong>{post.author}</strong>
                  <p>{post.role}</p>
                </div>
              </div>
              <div>
                <h3>{post.title}</h3>
                <p className="hero-copy">{post.body}</p>
              </div>
              <button className="btn ghost" type="button">
                Respond
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
