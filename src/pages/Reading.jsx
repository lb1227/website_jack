import React, { useMemo, useState } from "react";

const chapterData = [
  {
    id: 1,
    title: "Chapter 1 · Emberwake",
    access: "preview",
    content: [
      "Dawn never arrived all at once in Cindervale. It leaked through the smoke in strips of amber, painting the rooftops like cooling iron.",
      "Lyra balanced on the edge of the old aqueduct and counted six bells from the harbor tower before she dared to move. Below, carts groaned awake and bakers split firewood beside ovens that glowed red as dragon eyes.",
      "She unfolded her father’s map for the hundredth time, pressing two fingers over the charred crease where the mountain road disappeared. In neat ink he had written one warning: Follow the river only while it sings.",
      "A horn sounded from the west gate. Soldiers in obsidian cloaks marched in, carrying cages covered with canvas. Every step rattled something metal inside, and every watcher on the street suddenly found a reason to stare at their own shoes.",
      "Lyra tucked the map into her coat and whispered the first promise she had made herself in years. If the city was collecting monsters, she would learn which one had taken her father."
    ]
  },
  {
    id: 2,
    title: "Chapter 2 · The Gate Tax",
    access: "paid",
    content: [
      "The second gate was narrower than the first, and the taxman was meaner.",
      "..."
    ]
  },
  {
    id: 3,
    title: "Chapter 3 · Glass Lantern District",
    access: "paid",
    content: [
      "Lyra stepped into a district lit entirely by captive lightning.",
      "..."
    ]
  },
  {
    id: 4,
    title: "Chapter 4 · Moonwell Pact",
    access: "paid",
    content: [
      "The contract was written on silver leaf and sealed with rainwater.",
      "..."
    ]
  }
];

const totalChapters = chapterData.length;

export default function Reading() {
  const [selectedChapterId, setSelectedChapterId] = useState(1);
  const [hasPurchasedBook, setHasPurchasedBook] = useState(false);

  const selectedChapter = useMemo(
    () => chapterData.find((chapter) => chapter.id === selectedChapterId) ?? chapterData[0],
    [selectedChapterId]
  );

  const isLockedChapter = selectedChapter.access === "paid" && !hasPurchasedBook;

  const handleChapterSelect = (chapterId) => {
    setSelectedChapterId(chapterId);
  };

  const handlePurchase = () => {
    setHasPurchasedBook(true);
  };

  return (
    <main className="page-shell">
      <section className="reader" id="reading">
        <article className="reader-hero">
          <div className="reader-hero-main">
            <span className="pill">Reading Room</span>
            <h1>Rhapsody of Ember</h1>
            <p className="hero-subtitle">Free preview: first chapter unlocked</p>
            <p className="hero-copy">
              Read the opening chapter now. Purchase the full book to unlock all remaining chapters
              and continue where the story gets darker.
            </p>
            <div className="chapter-progress" aria-label="Book progress">
              <div className="chapter-progress-track" role="presentation">
                <span style={{ width: `${(selectedChapter.id / totalChapters) * 100}%` }} />
              </div>
              <p>
                Chapter {selectedChapter.id} of {totalChapters}
              </p>
            </div>
            <div className="reader-actions">
              <button className="btn primary" type="button" onClick={handlePurchase}>
                {hasPurchasedBook ? "✓ Book Purchased" : "Buy full book"}
              </button>
              <button className="btn ghost" type="button">
                Save preview
              </button>
            </div>
          </div>
          <aside className="reader-meta" aria-label="Book stats">
            <div>
              <strong>Author</strong>
              <p>Aria Vale</p>
            </div>
            <div>
              <strong>Genre</strong>
              <p>Epic fantasy</p>
            </div>
            <div>
              <strong>Access</strong>
              <p>{hasPurchasedBook ? "Full book unlocked" : "Preview mode"}</p>
            </div>
          </aside>
        </article>

        <section className="reader-layout">
          <aside className="chapter-list" aria-label="Chapter selection">
            <h2>Chapters</h2>
            <ul>
              {chapterData.map((chapter) => {
                const isLocked = chapter.access === "paid" && !hasPurchasedBook;
                const isActive = chapter.id === selectedChapter.id;
                return (
                  <li key={chapter.id} className={isActive ? "active" : ""}>
                    <button
                      type="button"
                      className={`chapter-select-btn ${isLocked ? "locked" : ""}`}
                      onClick={() => handleChapterSelect(chapter.id)}
                      aria-current={isActive ? "true" : undefined}
                    >
                      <span>{chapter.title}</span>
                      {isLocked && <small>Locked</small>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          <article className="reading-pane" aria-live="polite">
            <header className="reading-header">
              <div>
                <h2>{selectedChapter.title}</h2>
                <p>{isLockedChapter ? "Purchase required to continue." : "Now reading."}</p>
              </div>
              <div className="reading-tools">
                <button className="btn ghost" type="button">
                  A-
                </button>
                <button className="btn ghost" type="button">
                  A+
                </button>
              </div>
            </header>

            {isLockedChapter ? (
              <>
                <p>
                  You’ve reached the end of the free preview. Buy the full book to unlock this
                  chapter and every chapter after it.
                </p>
                <button className="btn primary" type="button" onClick={handlePurchase}>
                  Unlock all chapters
                </button>
              </>
            ) : (
              selectedChapter.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
            )}
          </article>
        </section>
      </section>
    </main>
  );
}
