import React from "react";
import PropTypes from "prop-types";

export default function LeaderboardSection({ title, subtitle, entries }) {
  const topThree = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <section className="leaderboard" id="leaderboard">
      <div className="leaderboard-header">
        <div>
          <h2>{title}</h2>
          <span className="row-subtitle">{subtitle}</span>
        </div>
        <div className="leaderboard-actions">
          <button className="btn ghost" type="button">
            This Week
          </button>
          <button className="btn ghost" type="button">
            Global
          </button>
        </div>
      </div>

      <div className="leaderboard-top">
        {topThree.map((entry) => (
          <div className="leaderboard-card" key={entry.creator}>
            <div className="leaderboard-rank">{entry.rank}</div>
            <div className="leaderboard-info">
              <span className="leaderboard-label">{entry.label}</span>
              <h3>{entry.creator}</h3>
              <p>{entry.title}</p>
            </div>
            <div className="leaderboard-score">
              <strong>{entry.score}</strong>
              <span>{entry.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="leaderboard-list">
        {rest.map((entry) => (
          <div className="leaderboard-row" key={entry.creator}>
            <div className="leaderboard-rank-badge">{entry.rank}</div>
            <div className="leaderboard-row-main">
              <div>
                <strong>{entry.creator}</strong>
                <span>{entry.title}</span>
              </div>
              <div className="leaderboard-meta">
                <span>{entry.score} rating</span>
                <span>{entry.reads}</span>
              </div>
            </div>
            <div className={`leaderboard-delta ${entry.delta.startsWith("+") ? "is-up" : "is-down"}`}>
              {entry.delta}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

LeaderboardSection.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      rank: PropTypes.number.isRequired,
      creator: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      score: PropTypes.string.isRequired,
      reads: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      trend: PropTypes.string.isRequired,
      delta: PropTypes.string.isRequired,
    })
  ).isRequired,
};
