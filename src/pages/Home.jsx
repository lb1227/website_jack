import React, { useEffect, useMemo, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import CardRow from "../components/CardRow.jsx";
import LeaderboardSection from "../components/LeaderboardSection.jsx";

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

const LEADERBOARD_ENTRIES = [
  {
    rank: 1,
    creator: "Rhapsody of Ember",
    title: "Epic fantasy series · 12 chapters",
    score: "9.6",
    reads: "420k reads",
    label: "Momentum pick",
    trend: "+18% week-over-week",
    delta: "+2",
  },
  {
    rank: 2,
    creator: "Blue Hour Letters",
    title: "Romantic drama · 8 chapters",
    score: "9.4",
    reads: "388k reads",
    label: "Breakout",
    trend: "+12% week-over-week",
    delta: "+1",
  },
  {
    rank: 3,
    creator: "Low Tide Legends",
    title: "Coastal mystery · 10 chapters",
    score: "9.3",
    reads: "350k reads",
    label: "Fan favorite",
    trend: "+9% week-over-week",
    delta: "-1",
  },
  {
    rank: 4,
    creator: "Frames of the Fallen",
    title: "Noir thriller · 6 chapters",
    score: "9.2",
    reads: "322k reads",
    label: "Editor spotlight",
    trend: "+6% week-over-week",
    delta: "+1",
  },
  {
    rank: 5,
    creator: "Starlit Syntax",
    title: "Sci-fi short · 5 chapters",
    score: "9.1",
    reads: "298k reads",
    label: "Critics pick",
    trend: "+5% week-over-week",
    delta: "-2",
  },
  {
    rank: 6,
    creator: "Paper Gardens",
    title: "Slice-of-life · 7 chapters",
    score: "9.0",
    reads: "281k reads",
    label: "Slow burn",
    trend: "+3% week-over-week",
    delta: "+1",
  },
  {
    rank: 7,
    creator: "Neon Caravan",
    title: "Cyberpunk travelogue · 9 chapters",
    score: "8.9",
    reads: "264k reads",
    label: "Binge ready",
    trend: "+2% week-over-week",
    delta: "-1",
  },
  {
    rank: 8,
    creator: "Harborlight",
    title: "Romance saga · 22 chapters",
    score: "8.8",
    reads: "243k reads",
    label: "Sustained hit",
    trend: "+2% week-over-week",
    delta: "+1",
  },
  {
    rank: 9,
    creator: "Inkbound Circuit",
    title: "Tech thriller · 11 chapters",
    score: "8.7",
    reads: "221k reads",
    label: "Underground",
    trend: "+1% week-over-week",
    delta: "-1",
  },
  {
    rank: 10,
    creator: "Signal to the Sea",
    title: "Adventure memoir · 4 chapters",
    score: "8.6",
    reads: "210k reads",
    label: "New entry",
    trend: "+1% week-over-week",
    delta: "+3",
  },
];

export default function Home() {
  const { searchQuery } = useOutletContext();
  const [activeRow, setActiveRow] = useState(0);
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

  return (
    <main id="home">
      <div className="search-status" data-search-status hidden={!normalizedQuery || matchCount > 0}>
        No matches yet — try another title or creator.
      </div>
      <section className="hero" id="main-home">
        <div className="hero-content">
          <span className="pill">Top 10 Creator Spotlight</span>
          <h1>Rhapsody of Ember</h1>
          <p className="hero-subtitle">Epic Fantasy • 12 chapters • 9.6 rating</p>
          <p className="hero-copy">
            A rising author builds a realm of ember and ash. Read free chapters, unlock premium arcs,
            and follow the creator’s journey to digital and print publishing.
          </p>
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
      </section>

      <LeaderboardSection
        title="Top 10 Zone"
        subtitle="Highest rated creators this week"
        entries={LEADERBOARD_ENTRIES}
      />

      {filteredRows.map((row, index) => (
        <div key={row.id} ref={(element) => (rowRefs.current[index] = element)}>
          <CardRow
            title={row.title}
            subtitle={row.subtitle}
            cards={row.cards}
            highlight={index === activeRow}
            anchorId={row.id}
          />
        </div>
      ))}
    </main>
  );
}
