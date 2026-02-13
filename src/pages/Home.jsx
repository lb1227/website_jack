import React, { useMemo } from "react";
import { useOutletContext } from "react-router-dom";

export default function Home() {
  const { searchQuery } = useOutletContext();
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const hasQuery = useMemo(() => normalizedQuery.length > 0, [normalizedQuery]);

  return (
    <main id="home">
      <section className="hero" id="main-home">
        <div className="hero-content">
          <span className="pill">Home</span>
          <h1>No books are currently listed</h1>
          <p className="hero-copy">
            Temporary featured items and existing books have been removed from the home feed.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="search-status" data-search-status>
          {hasQuery
            ? `No matches for "${searchQuery}" because there are no active books right now.`
            : "There are currently no active books to display."}
        </div>
      </section>
    </main>
  );
}
