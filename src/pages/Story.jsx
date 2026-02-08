import React from "react";

export default function Story() {
  return (
    <main className="page-shell">
      <section className="hero" id="story">
        <div className="hero-content">
          <span className="pill">Story Hub</span>
          <h1>Rhapsody of Ember</h1>
          <p className="hero-subtitle">Epic Fantasy • 12 chapters • 9.6 rating</p>
          <p className="hero-copy">
            Follow the saga, unlock premium arcs, and explore creator commentary for every chapter.
          </p>
          <div className="hero-actions">
            <button className="btn primary" type="button">
              Start Reading
            </button>
            <button className="btn ghost" type="button">
              Add to List
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
