import React, { useMemo, useState } from "react";

const LEADERBOARD_ENTRIES = [
  {
    rank: 1,
    creator: "Rhapsody of Ember",
    genre: "Epic Fantasy",
    momentum: "+24%",
    followers: "128k",
    rating: 9.6,
    highlight: "Season finale hits tomorrow.",
  },
  {
    rank: 2,
    creator: "Blue Hour Letters",
    genre: "Literary Romance",
    momentum: "+18%",
    followers: "94k",
    rating: 9.4,
    highlight: "Readers voted for the slow-burn arc.",
  },
  {
    rank: 3,
    creator: "Low Tide Legends",
    genre: "Coastal Mystery",
    momentum: "+16%",
    followers: "88k",
    rating: 9.3,
    highlight: "Bonus map revealed in the next drop.",
  },
  {
    rank: 4,
    creator: "Frames of the Fallen",
    genre: "Cinematic Noir",
    momentum: "+12%",
    followers: "79k",
    rating: 9.1,
    highlight: "Director’s cut chapters just unlocked.",
  },
  {
    rank: 5,
    creator: "Starlit Syntax",
    genre: "Sci-fi Thriller",
    momentum: "+10%",
    followers: "71k",
    rating: 9.0,
    highlight: "Live coding session with fans Friday.",
  },
  {
    rank: 6,
    creator: "Glass Orchard",
    genre: "Speculative Drama",
    momentum: "+9%",
    followers: "63k",
    rating: 8.9,
    highlight: "Season 2 teaser is out.",
  },
  {
    rank: 7,
    creator: "Neon Caravan",
    genre: "Found Family",
    momentum: "+8%",
    followers: "58k",
    rating: 8.8,
    highlight: "Behind-the-scenes notes released.",
  },
];

const CATEGORY_LABELS = ["All", "Fiction", "Sci-fi", "Romance", "Mystery"];

const SPOTLIGHT_CARDS = [
  {
    title: "Reader Satisfaction",
    value: "96%",
    detail: "Average completion rate on top 10 drops.",
  },
  {
    title: "Creator Momentum",
    value: "8.4%",
    detail: "Median weekly growth for featured writers.",
  },
  {
    title: "Fan Engagement",
    value: "42k",
    detail: "Weekly live chat reactions across the list.",
  },
];

export default function Leaderboard() {
  const [activeCategory, setActiveCategory] = useState(CATEGORY_LABELS[0]);

  const entries = useMemo(() => {
    if (activeCategory === "All") {
      return LEADERBOARD_ENTRIES;
    }
    return LEADERBOARD_ENTRIES.filter((entry) => entry.genre.includes(activeCategory));
  }, [activeCategory]);

  return (
    <main className="leaderboard-page">
      <section className="leaderboard-hero">
        <div>
          <p className="leaderboard-tag">Leaderboard</p>
          <h1>Creator League Table</h1>
          <p className="leaderboard-subtitle">
            Weekly rankings across story quality, retention, and reader delight. Tap into the
            momentum and watch the top creators climb.
          </p>
          <div className="leaderboard-actions">
            <button className="btn glow-danger" type="button">
              Follow top 10
            </button>
            <button className="btn ghost" type="button">
              View methodology
            </button>
          </div>
        </div>
        <div className="leaderboard-hero-card">
          <h2>📈 Momentum index</h2>
          <p>Updated 4 minutes ago</p>
          <div className="leaderboard-metric">
            <span>Average rating</span>
            <strong>9.3</strong>
          </div>
          <div className="leaderboard-metric">
            <span>New followers today</span>
            <strong>+3,420</strong>
          </div>
          <div className="leaderboard-metric">
            <span>Episodes released</span>
            <strong>52</strong>
          </div>
        </div>
      </section>

      <section className="leaderboard-stats">
        {SPOTLIGHT_CARDS.map((card) => (
          <article key={card.title} className="leaderboard-stat-card">
            <p>{card.title}</p>
            <h3>{card.value}</h3>
            <span>{card.detail}</span>
          </article>
        ))}
      </section>

      <section className="leaderboard-table">
        <div className="leaderboard-table-header">
          <div>
            <h2>Top creators this week</h2>
            <p>Based on reader completion, reviews, and drop cadence.</p>
          </div>
          <div className="leaderboard-filters" role="tablist" aria-label="Leaderboard categories">
            {CATEGORY_LABELS.map((label) => (
              <button
                key={label}
                type="button"
                className={activeCategory === label ? "active" : ""}
                role="tab"
                aria-selected={activeCategory === label}
                onClick={() => setActiveCategory(label)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="leaderboard-rows">
          {entries.map((entry) => (
            <article key={entry.rank} className="leaderboard-row">
              <div className="leaderboard-rank">#{entry.rank}</div>
              <div className="leaderboard-info">
                <div>
                  <h3>{entry.creator}</h3>
                  <p>{entry.genre}</p>
                </div>
                <p className="leaderboard-highlight">{entry.highlight}</p>
              </div>
              <div className="leaderboard-metrics">
                <div>
                  <span>Followers</span>
                  <strong>{entry.followers}</strong>
                </div>
                <div>
                  <span>Rating</span>
                  <strong>{entry.rating}</strong>
                </div>
                <div>
                  <span>Momentum</span>
                  <strong>{entry.momentum}</strong>
                </div>
              </div>
              <button className="btn ghost" type="button">
                View profile
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
