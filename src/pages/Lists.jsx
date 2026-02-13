import React from "react";

export default function Lists() {
  return (
    <main className="page-shell">
      <section className="hero hero-lists">
        <div className="hero-content">
          <span className="pill">Your Lists</span>
          <h1>No list items available</h1>
          <p className="hero-copy">All temporary and existing book list items have been removed.</p>
        </div>
      </section>

      <section className="section utility-page-section lists-page-section">
        <div>
          <div className="lists-header-row">
            <h2>Saved collections</h2>
          </div>
          <p>Your collections are empty.</p>
        </div>
      </section>
    </main>
  );
}
