import React from "react";

export default function History() {
  return (
    <main className="page-shell">
      <section className="hero hero-history">
        <div className="hero-content">
          <span className="pill">History</span>
          <h1>No recent book activity</h1>
          <p className="hero-copy">
            Book-related history has been cleared along with the temporary website content.
          </p>
        </div>
      </section>

      <section className="section utility-page-section history-page-section">
        <div>
          <div className="lists-header-row">
            <h2>Recent actions</h2>
          </div>
          <p>There are no tracked actions right now.</p>
        </div>
      </section>
    </main>
  );
}
