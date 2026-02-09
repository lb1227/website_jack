import React, { useEffect, useMemo, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import CardRow from "../components/CardRow.jsx";

const HERO_SPOTLIGHTS = [
  {
    id: "ember",
    label: "Top 10 Creator Spotlight",
    title: "Rhapsody of Ember",
    subtitle: "Epic Fantasy • 12 chapters • 9.6 rating",
    description:
      "A rising author builds a realm of ember and ash. Read free chapters, unlock premium arcs, and follow the creator’s journey to digital and print publishing.",
    cover: "https://picsum.photos/seed/ember-hero/1600/900",
  },
  {
    id: "harbor",
    label: "Top 10 Creator Spotlight",
    title: "Harborlight",
    subtitle: "Coastal Drama • 18 chapters • 9.4 rating",
    description:
      "A seaside anthology where every tide reveals a new secret. Dive into the conversations, annotated scenes, and live reader polls.",
    cover: "https://picsum.photos/seed/harbor-hero/1600/900",
  },
  {
    id: "neon",
    label: "Top 10 Creator Spotlight",
    title: "Neon Caravan",
    subtitle: "Sci-Fi Noir • 10 chapters • 9.3 rating",
    description:
      "Follow the neon trail of a cyber detective and unlock interactive dossiers crafted by the creator community.",
    cover: "https://picsum.photos/seed/neon-hero/1600/900",
  },
  {
    id: "archive",
    label: "Top 10 Creator Spotlight",
    title: "The Silent Archive",
    subtitle: "Mystery • 8 chapters • 9.1 rating",
    description:
      "An archive of unsolved tales with hidden bonus scenes. Choose the next investigation and vote on the reveal order.",
    cover: "https://picsum.photos/seed/archive-hero/1600/900",
  },
  {
    id: "mythic",
    label: "Top 10 Creator Spotlight",
    title: "Mythic Rewrites",
    subtitle: "Mythology • 14 chapters • 9.2 rating",
    description:
      "Reimagined legends told through immersive panels. Collect behind-the-scenes drafts and creator voice notes.",
    cover: "https://picsum.photos/seed/mythic-hero/1600/900",
  },
];

const ROWS = [
  {
    id: "new",
    title: "Trending Now",
    subtitle: "High-traction stories ready for paywall release",
    cards: [
      {
        title: "The Glass Orchard",
        image: "https://picsum.photos/seed/glass-orchard/640/360",
      },
      {
        title: "Signal to the Sea",
        image: "https://picsum.photos/seed/signal-to-the-sea/640/360",
      },
      {
        title: "Inkbound Circuit",
        image: "https://picsum.photos/seed/inkbound-circuit/640/360",
      },
      {
        title: "Paper Gardens",
        image: "https://picsum.photos/seed/paper-gardens/640/360",
      },
      {
        title: "Neon Caravan",
        image: "https://picsum.photos/seed/neon-caravan/640/360",
      },
      {
        title: "Harborlight",
        image: "https://picsum.photos/seed/harborlight/640/360",
      },
    ],
  },
  {
    id: "series",
    title: "Continue Reading",
    subtitle: "Pick up exactly where you left off",
    cards: [
      {
        title: "Harborlight — Ep. 22",
        image: "https://picsum.photos/seed/harborlight-22/640/360",
      },
      {
        title: "The Silent Archive — Ep. 6",
        image: "https://picsum.photos/seed/silent-archive/640/360",
      },
      {
        title: "Cosmic Blueprints — S2",
        image: "https://picsum.photos/seed/cosmic-blueprints/640/360",
      },
      {
        title: "Under the Clover — Ep. 4",
        image: "https://picsum.photos/seed/under-clover/640/360",
      },
      {
        title: "Midnight Sketches — Ep. 9",
        image: "https://picsum.photos/seed/midnight-sketches/640/360",
      },
    ],
  },
  {
    id: "leaderboard",
    title: "Top 10 Zone",
    subtitle: "Highest rated creators this week",
    cards: [
      {
        title: "Rhapsody of Ember",
        image: "https://picsum.photos/seed/rhapsody-ember/640/360",
        rank: 1,
      },
      {
        title: "Blue Hour Letters",
        image: "https://picsum.photos/seed/blue-hour-letters/640/360",
        rank: 2,
      },
      {
        title: "Low Tide Legends",
        image: "https://picsum.photos/seed/low-tide-legends/640/360",
        rank: 3,
      },
      {
        title: "Frames of the Fallen",
        image: "https://picsum.photos/seed/frames-fallen/640/360",
        rank: 4,
      },
      {
        title: "Starlit Syntax",
        image: "https://picsum.photos/seed/starlit-syntax/640/360",
        rank: 5,
      },
    ],
  },
  {
    id: "essays",
    title: "Genre Curation",
    subtitle: "Expert editors spotlight the best voices",
    cards: [
      {
        title: "Speculative Futures",
        image: "https://picsum.photos/seed/speculative-futures/640/360",
      },
      {
        title: "Quiet Realism",
        image: "https://picsum.photos/seed/quiet-realism/640/360",
      },
      {
        title: "Visual Verse",
        image: "https://picsum.photos/seed/visual-verse/640/360",
      },
      {
        title: "Mythic Rewrites",
        image: "https://picsum.photos/seed/mythic-rewrites/640/360",
      },
      {
        title: "Slice-of-Life Panels",
        image: "https://picsum.photos/seed/slice-life-panels/640/360",
      },
    ],
  },
];

export default function Home() {
  const { searchQuery } = useOutletContext();
  const [activeRow, setActiveRow] = useState(0);
  const [activeSpotlight, setActiveSpotlight] = useState(0);
  const rowRefs = useRef([]);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredRows = useMemo(() => {
    if (!normalizedQuery) return ROWS;
    return ROWS.map((row) => ({
      ...row,
      cards: row.cards.filter((card) => card.title.toLowerCase().includes(normalizedQuery)),
    }));
  }, [normalizedQuery]);

  const matchCount = useMemo(() => {
    if (!normalizedQuery) return 0;
    return filteredRows.reduce((total, row) => total + row.cards.length, 0);
  }, [filteredRows, normalizedQuery]);

  useEffect(() => {
    const handleHighlight = () => {
      const viewportCenter = window.innerHeight * 0.5;
      let nextIndex = 0;
      let minDistance = Number.POSITIVE_INFINITY;

      rowRefs.current.forEach((row, index) => {
        if (!row) return;
        const rect = row.getBoundingClientRect();
        const rowCenter = rect.top + rect.height * 0.5;
        const distance = Math.abs(rowCenter - viewportCenter);

        if (distance < minDistance) {
          minDistance = distance;
          nextIndex = index;
        }
      });

      setActiveRow(nextIndex);
    };

    let scheduled = false;
    const scheduleUpdate = () => {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(() => {
        handleHighlight();
        scheduled = false;
      });
    };

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    handleHighlight();

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  const spotlight = HERO_SPOTLIGHTS[activeSpotlight];

  return (
    <main id="home">
      <div className="search-status" data-search-status hidden={!normalizedQuery || matchCount > 0}>
        No matches yet — try another title or creator.
      </div>
      <section
        className={`hero ${spotlight.cover ? "has-featured-cover" : ""}`}
        id="main-home"
        style={spotlight.cover ? { "--featured-cover": `url(${spotlight.cover})` } : undefined}
      >
        <div className="hero-content">
          <span className="pill">{spotlight.label}</span>
          <h1>{spotlight.title}</h1>
          <p className="hero-subtitle">{spotlight.subtitle}</p>
          <p className="hero-copy">{spotlight.description}</p>
          <div className="hero-actions">
            <button className="btn primary" type="button">
              ▶ Read Now
            </button>
            <button className="btn ghost" type="button">
              + My List
            </button>
            <button className="btn ghost" type="button">
              Creator Profile
            </button>
          </div>
          <div className="hero-meta">
            <div>
              <span className="meta-label">Quality Curated</span>
              <strong>Expert reviewers</strong>
            </div>
            <div>
              <span className="meta-label">Paywall Ready</span>
              <strong>Episode 13+</strong>
            </div>
            <div>
              <span className="meta-label">Collab Chat</span>
              <strong>Live feedback</strong>
            </div>
          </div>
        </div>
        <div className="hero-carousel-dots" role="tablist" aria-label="Creator spotlight carousel">
          {HERO_SPOTLIGHTS.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={`hero-carousel-dot ${index === activeSpotlight ? "is-active" : ""}`}
              aria-label={`Show spotlight for ${item.title}`}
              aria-pressed={index === activeSpotlight}
              onClick={() => setActiveSpotlight(index)}
            />
          ))}
        </div>
      </section>

      {filteredRows.map((row, index) => (
        <div key={row.id} ref={(element) => (rowRefs.current[index] = element)}>
          <CardRow
            title={row.title}
            subtitle={row.subtitle}
            cards={row.cards}
            highlight={index === activeRow}
            isTrending={row.id === "new"}
            anchorId={row.id}
          />
        </div>
      ))}
    </main>
  );
}
