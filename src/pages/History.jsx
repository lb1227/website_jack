import React from "react";

const historyEvents = [
  "Finished Chapter 9 of Rhapsody of Ember",
  "Liked Episode 4 of Iron Bloom",
  "Started reading The Hollow Atlas",
  "Followed creator Nia Mercer",
];

export default function History() {
  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-content">
          <span className="pill">History</span>
          <h1>Your recent activity timeline</h1>
          <p className="hero-copy">
            Track what you read, liked, and followed so recommendations stay fresh and personal.
          </p>
        </div>
      </section>

      <section className="section utility-page-section">
        <h2>Recent actions</h2>
        <ul className="history-timeline">
          {historyEvents.map((event) => (
            <li key={event}>{event}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
