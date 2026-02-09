import React from "react";

export default function Profile() {
  return (
    <main className="profile-page" id="profile">
      <section className="profile-hero">
        <div className="profile-hero-card" data-profile-hero>
          <button
            className="profile-avatar"
            type="button"
            data-profile-avatar
            aria-label="Update profile photo"
          >
            <img data-profile-avatar-image alt="Profile photo" hidden />
          </button>
          <div className="profile-summary" data-profile-summary>
            <h1 className="profile-summary-name" data-profile-display="name">
              Username
            </h1>
            <p className="profile-summary-tags" data-profile-display="tags">
              empty · empty · empty
            </p>
            <p className="profile-summary-bio" data-profile-display="bio">
              Nothing here yet:(
            </p>
          </div>
          <form className="profile-inline-form" data-profile-form>
            <label className="profile-inline-field">
              <span>Display name</span>
              <input
                type="text"
                name="displayName"
                data-profile-input="name"
                placeholder="Add your display name"
              />
            </label>
            <label className="profile-inline-field">
              <span>Genres & tags</span>
              <input
                type="text"
                name="genres"
                data-profile-input="tags"
                placeholder="e.g. Fantasy · Cozy · Found family"
              />
            </label>
            <label className="profile-inline-field">
              <span>Bio</span>
              <textarea
                name="bio"
                rows="3"
                data-profile-input="bio"
                placeholder="Tell readers about your writing focus."
              ></textarea>
            </label>
            <div className="profile-form-actions">
              <button className="btn primary" type="submit">
                Save changes
              </button>
              <button className="btn ghost" type="button" data-profile-cancel>
                Cancel
              </button>
              <button className="btn ghost" type="button" data-profile-reset>
                Reset
              </button>
            </div>
          </form>
          <div className="profile-counts">
            <span>
              <strong>Works</strong> <span data-profile-count="works">0</span>
            </span>
            <span>
              <strong>Followers</strong> <span data-profile-count="followers">0</span>
            </span>
          </div>
          <div className="profile-actions">
            <button className="btn" type="button" data-profile-edit>
              Edit profile
            </button>
            <button className="btn glow-danger" type="button" data-profile-share>
              Share profile
            </button>
          </div>
          <p className="profile-status" data-profile-status></p>
        </div>
        <div className="profile-auth-overlay" data-auth-overlay hidden>
          <div className="profile-auth-window">
            <p className="auth-eyebrow">Welcome to PensUp</p>
            <h2>Sign in</h2>
            <div className="auth-grid">
              <form className="auth-card" data-auth-form="signin" data-auth-panel="signin">
                <h3>Sign in</h3>
                <label>
                  Username
                  <input
                    type="text"
                    name="signinUsername"
                    autoComplete="username"
                    required
                    data-auth-input="signin-username"
                  />
                </label>
                <label>
                  Password
                  <input
                    type="password"
                    name="signinPassword"
                    autoComplete="current-password"
                    required
                    data-auth-input="signin-password"
                  />
                </label>
                <div className="auth-card-actions">
                  <button className="btn" type="submit">
                    Sign in
                  </button>
                  <button className="btn ghost glow-danger" type="button" data-auth-toggle="signup">
                    Create account
                  </button>
                </div>
              </form>
              <form className="auth-card" data-auth-form="signup" data-auth-panel="signup" hidden>
                <h3>Create account</h3>
                <label>
                  Username
                  <input
                    type="text"
                    name="signupUsername"
                    autoComplete="username"
                    required
                    data-auth-input="signup-username"
                  />
                </label>
                <label>
                  Password
                  <input
                    type="password"
                    name="signupPassword"
                    autoComplete="new-password"
                    required
                    data-auth-input="signup-password"
                  />
                </label>
                <div className="auth-card-actions">
                  <button className="btn glow-danger" type="submit">
                    Create account
                  </button>
                  <button className="btn ghost" type="button" data-auth-toggle="signin">
                    Back to sign in
                  </button>
                </div>
              </form>
            </div>
            <p className="auth-status" data-auth-status></p>
          </div>
        </div>
      </section>

      <section className="profile-series" data-profile-series hidden>
        <div className="section-header">
          <h2>Your series</h2>
        </div>
        <div className="series-grid" data-series-grid></div>
      </section>

      <section className="profile-feed">
        <div className="section-header">
          <h2>Feed</h2>
        </div>
        <article className="feed-card">
          <div className="feed-body">
            <p></p>
          </div>
          <div className="feed-media"></div>
        </article>
      </section>
    </main>
  );
}
