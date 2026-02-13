import React from "react";

export default function Reading() {
  return (
    <main className="page-shell">
      <section className="reader-layout" id="reading">
        <article className="reading-pane" aria-live="polite">
          <header className="reading-header">
            <div>
              <h2>Reading is currently unavailable</h2>
              <p>All temporary books, chapters, and sample reading items have been removed.</p>
            </div>
          </header>
          <p>Please publish a new title to restore the reading experience.</p>
        </article>
      </section>
    </main>
  );
}
