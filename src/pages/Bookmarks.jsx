import React from "react";

export default function Bookmarks() {
  return (
    <main className="page-shell">
      <section className="hero hero-bookmarks">
        <div className="hero-content">
          <span className="pill">Bookmarks</span>
          <h1>No bookmarked books</h1>
          <p className="hero-copy">All temporary bookmarks and existing book entries have been removed.</p>
        </div>
      </section>

      <section className="section utility-page-section bookmarks-page-section">
        <div>
          <div className="lists-header-row">
            <h2>Recent bookmarks</h2>
          </div>
          <p>Nothing to show yet.</p>
        </div>
      </section>
    </main>
  );
}
