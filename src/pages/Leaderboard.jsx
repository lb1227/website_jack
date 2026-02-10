import React from "react";

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

export default function Leaderboard() {
  return (
    <main className="leaderboard-page">
      <section className="leaderboard-table">
        <div className="leaderboard-table-header">
          <div>
            <h2>Top creators this week</h2>
            <p>Only showing this week's top creators.</p>
          </div>
        </div>

        <div className="leaderboard-rows">
          {LEADERBOARD_ENTRIES.map((entry) => (
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
