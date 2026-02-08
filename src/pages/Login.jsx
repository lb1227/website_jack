import React from "react";

export default function Login() {
  return (
    <main className="page-shell">
      <section className="hero" id="login">
        <div className="hero-content">
          <span className="pill">Welcome Back</span>
          <h1>Sign in to PensUp</h1>
          <p className="hero-subtitle">Pick up your reading list and creator insights.</p>
          <div className="hero-actions">
            <button className="btn primary" type="button">
              Continue with Email
            </button>
            <button className="btn ghost" type="button">
              Continue with Google
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
