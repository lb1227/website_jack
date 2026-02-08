import React from "react";

export default function Profile() {
  return (
    <main className="page-shell">
      <section className="hero" id="profile">
        <div className="hero-content">
          <span className="pill">Creator Dashboard</span>
          <h1>Hi, Avery</h1>
          <p className="hero-subtitle">3 active series • 12,430 followers</p>
          <p className="hero-copy">
            Track readership stats, respond to feedback, and manage your publishing calendar.
          </p>
          <div className="hero-actions">
            <button className="btn primary" type="button">
              View Analytics
            </button>
            <button className="btn ghost" type="button">
              Edit Profile
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
