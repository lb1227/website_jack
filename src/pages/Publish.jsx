import React from "react";

export default function Publish() {
  return (
    <main className="page-shell">
      <section className="hero" id="publish">
        <div className="hero-content">
          <span className="pill">Launch Hub</span>
          <h1>Publish your next chapter</h1>
          <p className="hero-subtitle">Schedule drops, set pricing, and preview your paywall.</p>
          <div className="hero-actions">
            <button className="btn primary" type="button">
              Create Release
            </button>
            <button className="btn ghost" type="button">
              View Drafts
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
