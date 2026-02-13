import React from "react";

const LEADERBOARD_ENTRIES_BY_PERIOD = {
  weekly: [
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
  ],
  monthly: [
    {
      rank: 1,
      creator: "Blue Hour Letters",
      genre: "Literary Romance",
      momentum: "+28%",
      followers: "132k",
      rating: 9.7,
      highlight: "Monthly marathon chapter stayed #1 all month.",
    },
    {
      rank: 2,
      creator: "Rhapsody of Ember",
      genre: "Epic Fantasy",
      momentum: "+22%",
      followers: "128k",
      rating: 9.6,
      highlight: "Fan theories pushed this saga to a new peak.",
    },
    {
      rank: 3,
      creator: "Frames of the Fallen",
      genre: "Cinematic Noir",
      momentum: "+18%",
      followers: "101k",
      rating: 9.4,
      highlight: "Director's cut week drove binge sessions.",
    },
    {
      rank: 4,
      creator: "Low Tide Legends",
      genre: "Coastal Mystery",
      momentum: "+16%",
      followers: "96k",
      rating: 9.2,
      highlight: "Readers unlocked three hidden clues this month.",
    },
    {
      rank: 5,
      creator: "Glass Orchard",
      genre: "Speculative Drama",
      momentum: "+15%",
      followers: "82k",
      rating: 9.1,
      highlight: "Season 2 reveal trailer boosted re-reads.",
    },
  ],
  yearly: [
    {
      rank: 1,
      creator: "Rhapsody of Ember",
      genre: "Epic Fantasy",
      momentum: "+72%",
      followers: "304k",
      rating: 9.8,
      highlight: "Crowned creator of the year by reader votes.",
    },
    {
      rank: 2,
      creator: "Starlit Syntax",
      genre: "Sci-fi Thriller",
      momentum: "+64%",
      followers: "276k",
      rating: 9.6,
      highlight: "Year-long ARG campaign drew a huge following.",
    },
    {
      rank: 3,
      creator: "Blue Hour Letters",
      genre: "Literary Romance",
      momentum: "+58%",
      followers: "251k",
      rating: 9.5,
      highlight: "Most completed romance series this year.",
    },
    {
      rank: 4,
      creator: "Neon Caravan",
      genre: "Found Family",
      momentum: "+51%",
      followers: "214k",
      rating: 9.3,
      highlight: "Community picks kept this title trending.",
    },
    {
      rank: 5,
      creator: "Frames of the Fallen",
      genre: "Cinematic Noir",
      momentum: "+48%",
      followers: "207k",
      rating: 9.2,
      highlight: "Award-winning finale closed the season strong.",
    },
  ],
};

const LEADERBOARD_PERIODS = [
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "yearly", label: "Yearly" },
];

export default function Leaderboard() {
  const [selectedPeriod, setSelectedPeriod] = React.useState("weekly");
  const leaderboardEntries = LEADERBOARD_ENTRIES_BY_PERIOD[selectedPeriod];

  return (
    <main className="leaderboard-page">
      <section className="leaderboard-table">
        <div className="leaderboard-table-header">
          <div>
            <h2>Top creators this {selectedPeriod.slice(0, -2)}</h2>
            <p>Showing the current {selectedPeriod} leaderboard.</p>
          </div>
          <div className="leaderboard-filters" aria-label="Leaderboard period filters">
            {LEADERBOARD_PERIODS.map((period) => (
              <button
                key={period.key}
                type="button"
                className={selectedPeriod === period.key ? "active" : ""}
                onClick={() => setSelectedPeriod(period.key)}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        <div className="leaderboard-rows">
          {leaderboardEntries.map((entry) => (
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
