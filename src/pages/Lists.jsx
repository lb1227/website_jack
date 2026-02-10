import React from "react";

const curatedLists = [
  {
    title: "Late Night Mind-Benders",
    description: "Twisty psychological serials for 2am binge marathons.",
    count: "12 stories",
  },
  {
    title: "Slow Burn Romance",
    description: "Character-first arcs with long-build emotional payoffs.",
    count: "8 stories",
  },
  {
    title: "Worldbuilding Gold",
    description: "Deep fantasy and sci-fi universes worth getting lost in.",
    count: "16 stories",
  },
];

export default function Lists() {
  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-content">
          <span className="pill">Your Lists</span>
          <h1>Build reading lanes for every mood</h1>
          <p className="hero-copy">
            Keep your TBR organized with custom shelves so you can jump into the right story
            instantly.
          </p>
        </div>
      </section>

      <section className="section utility-page-section">
        <h2>Saved collections</h2>
        <div className="list-grid">
          {curatedLists.map((list) => (
            <article className="list-card" key={list.title}>
              <h3>{list.title}</h3>
              <p>{list.description}</p>
              <small>{list.count}</small>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
