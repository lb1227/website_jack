import React, { useEffect, useMemo, useState } from "react";


const steps = [
  {
    id: "details",
    title: "Book details",
    subtitle: "Set up your listing the way it will appear to readers.",
  },
  {
    id: "content",
    title: "Content plan",
    subtitle: "Upload your manuscript, art, and schedule for how chapters will go live.",
  },
  {
    id: "pricing",
    title: "Pricing",
    subtitle: "Define the price, discounts, and reader access options.",
  },
];

export default function Publish() {
  const [currentStep, setCurrentStep] = useState(0);
  const [maxUnlocked, setMaxUnlocked] = useState(0);
  const [series, setSeries] = useState("");
  const [title, setTitle] = useState("");
  const [cover, setCover] = useState("");
  const [hasAuthorMode, setHasAuthorMode] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const syncAuthorMode = () => {
      setHasAuthorMode(window.localStorage.getItem("pensup.profileType") === "author");
    };

    syncAuthorMode();
    window.addEventListener("storage", syncAuthorMode);
    window.addEventListener("focus", syncAuthorMode);
    window.addEventListener("pageshow", syncAuthorMode);
    document.addEventListener("visibilitychange", syncAuthorMode);

    return () => {
      window.removeEventListener("storage", syncAuthorMode);
      window.removeEventListener("focus", syncAuthorMode);
      window.removeEventListener("pageshow", syncAuthorMode);
      document.removeEventListener("visibilitychange", syncAuthorMode);
    };
  }, []);

  const tabs = useMemo(
    () => [
      { label: "Details", index: 0 },
      { label: "Content", index: 1 },
      { label: "Pricing", index: 2 },
    ],
    [],
  );

  const handleNext = () => {
    const nextIndex = Math.min(currentStep + 1, steps.length - 1);
    setMaxUnlocked((prev) => Math.max(prev, nextIndex));
    setCurrentStep(nextIndex);
  };

  const handleTabClick = (index) => {
    if (index > maxUnlocked) {
      return;
    }
    setCurrentStep(index);
  };

  const handleFinish = () => {
    if (typeof window === "undefined") {
      return;
    }
    const publishedKey = "pensup.publishedWorks";
    const username = window.localStorage.getItem("pensup.currentUser") || "author";
    const entry = {
      username,
      series,
      title: title || "Untitled work",
      cover,
      createdAt: new Date().toISOString(),
    };
    const stored = window.localStorage.getItem(publishedKey);
    let parsed = [];
    if (stored) {
      try {
        const candidate = JSON.parse(stored);
        parsed = Array.isArray(candidate) ? candidate : [];
      } catch {
        parsed = [];
      }
    }
    const updated = [entry, ...parsed];
    window.localStorage.setItem(publishedKey, JSON.stringify(updated));
  };

  return (
    <main className="publish-page page-shell">
      <section className="publish-header">
        <div>
          <h1>Apply to publish</h1>
          <p>Apply for Author Mode to access the publishing studio.</p>
        </div>
        <button className="publish-button" type="button">
          Start a new publication
        </button>
      </section>

      <section className="publish-card publish-application">
        <div className="publish-card-header">
          <h2>Apply for Author Mode</h2>
          <p>Tell us about your publishing goals. Admins review every application.</p>
        </div>
        <form className="publish-form" action="#">
          <label>
            <span>Pen name</span>
            <input type="text" placeholder="Your author name" />
          </label>
          <label>
            <span>Writing portfolio or pitch</span>
            <textarea rows="4" placeholder="Share your experience, samples, or publishing goals." />
          </label>
          <div>
            <button className="publish-button publish-button-secondary" type="submit">
              Submit application
            </button>
          </div>
        </form>
      </section>

      {hasAuthorMode ? (
        <>
          <section className="publish-tabs" aria-label="Publish steps">
            {tabs.map((tab) => {
              const isLocked = tab.index > maxUnlocked;
              const isActive = tab.index === currentStep;
              return (
                <button
                  className={`publish-tab ${isActive ? "active" : ""}`.trim()}
                  type="button"
                  key={tab.label}
                  disabled={isLocked}
                  aria-disabled={isLocked}
                  aria-selected={isActive}
                  onClick={() => handleTabClick(tab.index)}
                >
                  <span>{tab.index + 1}</span>
                  {tab.label}
                </button>
              );
            })}
          </section>

          <section className="publish-card publish-details" hidden={currentStep !== 0}>
        <div className="publish-card-header">
          <h2>{steps[0].title}</h2>
          <p>{steps[0].subtitle}</p>
        </div>
        <form className="publish-form" action="#">
          <div className="publish-form-grid">
            <label>
              <span>Language</span>
              <select>
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </label>
            <label>
              <span>Series</span>
              <input
                type="text"
                placeholder="Optional series name"
                value={series}
                onChange={(event) => setSeries(event.target.value)}
              />
            </label>
          </div>
          <label>
            <span>Book title</span>
            <input
              type="text"
              placeholder=""
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>
          <label>
            <span>Subtitle</span>
            <input type="text" placeholder="Optional subtitle" />
          </label>
          <div className="publish-form-grid">
            <label>
              <span>Edition number</span>
              <input type="text" placeholder="First edition" />
            </label>
            <label>
              <span>Author display name</span>
              <input type="text" placeholder="Author name shown to readers" />
            </label>
          </div>
          <label>
            <span>Description</span>
            <textarea rows="4" placeholder="" />
          </label>
          <div className="publish-form-grid">
            <label>
              <span>Categories (comma separated)</span>
              <input type="text" placeholder="Fantasy, Romance" />
            </label>
            <label>
              <span>Keywords (comma separated)</span>
              <input type="text" placeholder="Epic, Found family" />
            </label>
          </div>
          <div className="publish-form-grid">
            <label>
              <span>Publishing rights</span>
              <select>
                <option>I own the copyright</option>
                <option>I have publishing rights</option>
                <option>Public domain</option>
              </select>
            </label>
            <label>
              <span>Explicit content</span>
              <select>
                <option>No</option>
                <option>Yes</option>
              </select>
            </label>
          </div>
          <div className="publish-form-grid">
            <label>
              <span>Minimum reader age</span>
              <input type="number" placeholder="13" />
            </label>
            <label>
              <span>Maximum reader age</span>
              <input type="text" placeholder="18+" />
            </label>
          </div>
          <div className="publish-form-actions">
            <button className="publish-button" type="button" onClick={handleNext}>
              Save &amp; continue
            </button>
          </div>
        </form>
          </section>

          <section className="publish-card publish-content" hidden={currentStep !== 1}>
        <div className="publish-card-header">
          <h2>{steps[1].title}</h2>
          <p>{steps[1].subtitle}</p>
        </div>
        <form className="publish-form" action="#">
          <label>
            <span>Manuscript file</span>
            <input type="text" placeholder="Drag & drop or paste a file link" />
          </label>
          <div className="publish-form-grid">
            <label>
              <span>Cover art</span>
              <input
                type="text"
                placeholder="Upload a cover image or paste a URL"
                value={cover}
                onChange={(event) => setCover(event.target.value)}
              />
            </label>
            <label>
              <span>Supplemental files</span>
              <input type="text" placeholder="Maps, playlists, or bonus chapters" />
            </label>
          </div>
          <div className="publish-form-grid">
            <label>
              <span>Release cadence</span>
              <select>
                <option>Weekly</option>
                <option>Bi-weekly</option>
                <option>Monthly</option>
              </select>
            </label>
            <label>
              <span>First launch date</span>
              <input type="text" placeholder="October 15, 2024" />
            </label>
          </div>
          <label>
            <span>Reader notes</span>
            <textarea rows="3" placeholder="Share any author notes or launch details for readers." />
          </label>
          <div className="publish-form-actions">
            <button className="publish-button" type="button" onClick={handleNext}>
              Save &amp; continue
            </button>
          </div>
        </form>
          </section>

          <section className="publish-card publish-pricing" hidden={currentStep !== 2}>
        <div className="publish-card-header">
          <h2>{steps[2].title}</h2>
          <p>{steps[2].subtitle}</p>
        </div>
        <form className="publish-form" action="#">
          <div className="publish-form-grid">
            <label>
              <span>List price</span>
              <input type="text" placeholder="$7.99" />
            </label>
            <label>
              <span>Currency</span>
              <select>
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
              </select>
            </label>
          </div>
          <div className="publish-form-grid">
            <label>
              <span>Launch discount</span>
              <input type="text" placeholder="20% off for 7 days" />
            </label>
            <label>
              <span>Reader access</span>
              <select>
                <option>One-time purchase</option>
                <option>Monthly subscription</option>
                <option>Free first chapter</option>
              </select>
            </label>
          </div>
          <label>
            <span>Royalty split notes</span>
            <textarea rows="3" placeholder="Document revenue sharing or collaborator splits." />
          </label>
          <div className="publish-form-actions">
            <button
              className="publish-button publish-button-secondary"
              type="button"
              onClick={handleFinish}
            >
              Finish setup
            </button>
          </div>
        </form>
          </section>
        </>
      ) : (
        <section className="publish-card">
          <div className="publish-card-header">
            <h2>Author Mode required</h2>
            <p>Switch your profile to Author Mode to unlock the publishing setup form.</p>
          </div>
        </section>
      )}
    </main>
  );
}
