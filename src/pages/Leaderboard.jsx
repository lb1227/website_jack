import React from "react";

export default function Leaderboard() {
  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-content">
          <span className="pill">Leaderboard</span>
          <h1>No ranked books available</h1>
          <p className="hero-copy">All current temporary and seeded book rankings were removed.</p>
        </div>
      </section>

      <section className="section">
        <p>Leaderboard data will appear after new titles are published.</p>
      </section>
    </main>
  );
}
