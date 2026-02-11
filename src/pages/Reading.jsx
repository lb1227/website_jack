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

export default function Reading() {
  const [selectedChapterId, setSelectedChapterId] = useState(1);
  const [hasPurchasedBook, setHasPurchasedBook] = useState(false);
  const [bookmarkedChapterIds, setBookmarkedChapterIds] = useState([]);
  const [listedChapterIds, setListedChapterIds] = useState([]);

  const selectedChapter = useMemo(
    () => chapterData.find((chapter) => chapter.id === selectedChapterId) ?? chapterData[0],
    [selectedChapterId]
  );

  const isLockedChapter = selectedChapter.access === "paid" && !hasPurchasedBook;
  const isBookmarked = bookmarkedChapterIds.includes(selectedChapter.id);
  const isInList = listedChapterIds.includes(selectedChapter.id);

  const handlePurchase = () => {
    setHasPurchasedBook(true);
  };

  const toggleBookmark = () => {
    setBookmarkedChapterIds((prev) =>
      prev.includes(selectedChapter.id)
        ? prev.filter((chapterId) => chapterId !== selectedChapter.id)
        : [...prev, selectedChapter.id]
    );
  };

  const toggleList = () => {
    setListedChapterIds((prev) =>
      prev.includes(selectedChapter.id)
        ? prev.filter((chapterId) => chapterId !== selectedChapter.id)
        : [...prev, selectedChapter.id]
    );
  };

  return (
    <main className="page-shell">
      <section className="reader-layout" id="reading">
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
                    onClick={() => setSelectedChapterId(chapter.id)}
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
              <p>{isLockedChapter ? "Preview ended. Purchase required." : "Reading preview"}</p>
            </div>
            <div className="reading-tools">
              <button className="btn ghost" type="button" onClick={toggleBookmark}>
                {isBookmarked ? "✓ Bookmarked" : "+ Add bookmark"}
              </button>
              <button className="btn ghost" type="button" onClick={toggleList}>
                {isInList ? "✓ Added to list" : "+ Add to list"}
              </button>
            </div>
          </header>

          {isLockedChapter ? (
            <>
              <p>
                You’ve reached the end of the free first chapter. Buy the full book to unlock this
                chapter and all remaining chapters.
              </p>
              <button className="btn primary" type="button" onClick={handlePurchase}>
                Buy full book
              </button>
            </>
          ) : (
            selectedChapter.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
          )}
        </article>
      </section>
    </main>
  );
}
