import React from "react";

const bookmarkedStories = [
  { title: "Glass Harbor", detail: "Chapter 17 • saved 3 hours ago" },
  { title: "Neon Orchard", detail: "Chapter 6 • saved yesterday" },
  { title: "The Fifth Gate", detail: "Chapter 28 • saved 2 days ago" },
];

export default function Bookmarks() {
  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-content">
          <span className="pill">Bookmarks</span>
          <h1>Pick up exactly where you left off</h1>
          <p className="hero-copy">
            Your latest saves are synced across devices, complete with notes and highlights.
          </p>
        </div>
      </section>

      <section className="section utility-page-section">
        <h2>Recent bookmarks</h2>
        <div className="bookmark-list">
          {bookmarkedStories.map((story) => (
            <article className="bookmark-card" key={story.title}>
              <h3>{story.title}</h3>
              <p>{story.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
