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
  const [isListPickerOpen, setIsListPickerOpen] = useState(false);
  const [collections, setCollections] = useState([
    {
      id: 1,
      name: "Temp collection",
      cover:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80"
    }
  ]);
  const [chapterCollectionMap, setChapterCollectionMap] = useState({});
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionCover, setNewCollectionCover] = useState("");

  const selectedChapter = useMemo(
    () => chapterData.find((chapter) => chapter.id === selectedChapterId) ?? chapterData[0],
    [selectedChapterId]
  );

  const isLockedChapter = selectedChapter.access === "paid" && !hasPurchasedBook;
  const isBookmarked = bookmarkedChapterIds.includes(selectedChapter.id);
  const chapterCollectionIds = chapterCollectionMap[selectedChapter.id] ?? [];
  const isInList = chapterCollectionIds.length > 0;

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

  const toggleCollectionForChapter = (collectionId) => {
    setChapterCollectionMap((prev) => {
      const currentCollectionIds = prev[selectedChapter.id] ?? [];
      const isSelected = currentCollectionIds.includes(collectionId);

      return {
        ...prev,
        [selectedChapter.id]: isSelected
          ? currentCollectionIds.filter((id) => id !== collectionId)
          : [...currentCollectionIds, collectionId]
      };
    });
  };

  const handleCreateCollection = (event) => {
    event.preventDefault();

    const trimmedName = newCollectionName.trim();
    const trimmedCover = newCollectionCover.trim();

    if (!trimmedName) {
      return;
    }

    const newCollection = {
      id: Date.now(),
      name: trimmedName,
      cover: trimmedCover
    };

    setCollections((prev) => [...prev, newCollection]);
    setChapterCollectionMap((prev) => ({
      ...prev,
      [selectedChapter.id]: [...(prev[selectedChapter.id] ?? []), newCollection.id]
    }));
    setNewCollectionName("");
    setNewCollectionCover("");
    setIsListPickerOpen(true);
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
              <button
                className={`btn ghost ${isListPickerOpen ? "active" : ""}`}
                type="button"
                onClick={() => setIsListPickerOpen((prev) => !prev)}
                aria-expanded={isListPickerOpen}
                aria-controls="collection-picker"
              >
                {isInList ? `✓ In ${chapterCollectionIds.length} collection(s)` : "+ Add to list"}
              </button>
            </div>
          </header>

          {isListPickerOpen && (
            <section className="collection-picker" id="collection-picker" aria-label="Add to collection">
              <div className="collection-picker-heading">
                <h3>Add to collection</h3>
                <p>Pick collections for this chapter or make a new one.</p>
              </div>

              <ul>
                {collections.map((collection) => {
                  const isSelected = chapterCollectionIds.includes(collection.id);

                  return (
                    <li key={collection.id}>
                      <button
                        type="button"
                        className={`collection-item ${isSelected ? "selected" : ""}`}
                        onClick={() => toggleCollectionForChapter(collection.id)}
                      >
                        <span className="collection-cover" aria-hidden="true">
                          {collection.cover ? (
                            <img src={collection.cover} alt="" loading="lazy" />
                          ) : (
                            <span>{collection.name[0]?.toUpperCase() ?? "C"}</span>
                          )}
                        </span>
                        <span className="collection-name">{collection.name}</span>
                        <span className="collection-check" aria-hidden="true">
                          {isSelected ? "✓" : "+"}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <form className="collection-create" onSubmit={handleCreateCollection}>
                <h4>Create new collection</h4>
                <label>
                  Collection name
                  <input
                    type="text"
                    value={newCollectionName}
                    onChange={(event) => setNewCollectionName(event.target.value)}
                    placeholder="e.g. Cozy fantasy"
                    required
                  />
                </label>
                <label>
                  Collection picture URL
                  <input
                    type="url"
                    value={newCollectionCover}
                    onChange={(event) => setNewCollectionCover(event.target.value)}
                    placeholder="https://..."
                  />
                </label>
                <button className="btn primary" type="submit">
                  Create collection
                </button>
              </form>
            </section>
          )}

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
