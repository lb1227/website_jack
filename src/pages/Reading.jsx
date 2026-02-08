import React from "react";

export default function Reading() {
  return (
    <main className="page-shell">
      <section className="hero" id="reading">
        <div className="hero-content">
          <span className="pill">Reading Room</span>
          <h1>Continue Rhapsody of Ember</h1>
          <p className="hero-subtitle">Chapter 9 • 18 min read</p>
          <p className="hero-copy">
            Jump back into the latest episode with synced bookmarks, inline comments, and creator
            annotations.
          </p>
          <div className="hero-actions">
            <button className="btn primary" type="button">
              ▶ Resume Reading
            </button>
            <button className="btn ghost" type="button">
              Download
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
