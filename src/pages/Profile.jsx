import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "pensup.profile";
const AUTH_KEY = "pensup.authenticated";
const EMPTY_PROFILE = {
  name: "Username",
  tags: "empty · empty · empty",
  bio: "Nothing here yet:(",
  avatar: "",
  counts: {
    works: 0,
    followers: 0,
  },
};

const loadProfile = () => {
  if (typeof window === "undefined") {
    return EMPTY_PROFILE;
  }
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return EMPTY_PROFILE;
    }
    const parsed = JSON.parse(stored);
    return {
      ...EMPTY_PROFILE,
      ...parsed,
      counts: {
        ...EMPTY_PROFILE.counts,
        ...(parsed?.counts ?? {}),
      },
    };
  } catch {
    return EMPTY_PROFILE;
  }
};

const persistProfile = (profile) => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
};

export default function Profile() {
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [formValues, setFormValues] = useState(EMPTY_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState("signin");
  const [authStatus, setAuthStatus] = useState("");

  useEffect(() => {
    const stored = loadProfile();
    setProfile(stored);
    setFormValues(stored);
    if (typeof window !== "undefined") {
      setIsAuthenticated(window.localStorage.getItem(AUTH_KEY) === "true");
    }
  }, []);

  const statusMessage = useMemo(() => {
    if (status) {
      return status;
    }
    if (!isEditing) {
      return "Profile saved. Changes appear immediately.";
    }
    return "Edit your profile details below.";
  }, [isEditing, status]);

  const handleEditClick = () => {
    if (!isAuthenticated) {
      setAuthStatus("Sign in to edit your profile.");
      return;
    }
    setIsEditing(true);
    setFormValues(profile);
    setStatus("");
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSave = (event) => {
    event.preventDefault();
    if (!isAuthenticated) {
      setAuthStatus("Sign in to save changes.");
      return;
    }
    setProfile(formValues);
    persistProfile(formValues);
    setIsEditing(false);
    setStatus("Profile updated.");
  };

  const handleCancel = () => {
    setFormValues(profile);
    setIsEditing(false);
    setStatus("Edits discarded.");
  };

  const handleReset = () => {
    if (!isAuthenticated) {
      setAuthStatus("Sign in to reset your profile.");
      return;
    }
    setFormValues(EMPTY_PROFILE);
    setProfile(EMPTY_PROFILE);
    persistProfile(EMPTY_PROFILE);
    setIsEditing(false);
    setStatus("Profile reset.");
  };

  const handleAuthToggle = (nextMode) => {
    setAuthMode(nextMode);
    setAuthStatus("");
  };

  const handleAuthSubmit = (event) => {
    event.preventDefault();
    if (typeof window !== "undefined") {
      window.localStorage.setItem(AUTH_KEY, "true");
    }
    setIsAuthenticated(true);
    setAuthStatus("Welcome back! You can update your profile now.");
  };

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(AUTH_KEY, "false");
    }
    setIsAuthenticated(false);
    setIsEditing(false);
    setAuthStatus("Signed out. Sign in to continue.");
  };

  return (
    <main className="profile-page" id="profile">
      <section className="profile-hero">
        <div
          className={`profile-hero-card ${isEditing ? "is-editing" : ""} ${
            isAuthenticated ? "" : "is-locked"
          }`.trim()}
          data-profile-hero
        >
          <button
            className={`profile-avatar ${isEditing ? "is-editable" : ""}`.trim()}
            type="button"
            data-profile-avatar
            aria-label="Update profile photo"
          >
            <img
              data-profile-avatar-image
              alt="Profile photo"
              src={profile.avatar || undefined}
              hidden={!profile.avatar}
            />
          </button>
          <div className="profile-summary" data-profile-summary>
            <h1 className="profile-summary-name" data-profile-display="name">
              {profile.name}
            </h1>
            <p className="profile-summary-tags" data-profile-display="tags">
              {profile.tags}
            </p>
            <p className="profile-summary-bio" data-profile-display="bio">
              {profile.bio}
            </p>
          </div>
          <form className="profile-inline-form" data-profile-form onSubmit={handleSave}>
            <label className="profile-inline-field">
              <span>Display name</span>
              <input
                type="text"
                name="name"
                data-profile-input="name"
                placeholder="Add your display name"
                value={formValues.name}
                onChange={handleInputChange}
              />
            </label>
            <label className="profile-inline-field">
              <span>Genres & tags</span>
              <input
                type="text"
                name="tags"
                data-profile-input="tags"
                placeholder="e.g. Fantasy · Cozy · Found family"
                value={formValues.tags}
                onChange={handleInputChange}
              />
            </label>
            <label className="profile-inline-field">
              <span>Bio</span>
              <textarea
                name="bio"
                rows="3"
                data-profile-input="bio"
                placeholder="Tell readers about your writing focus."
                value={formValues.bio}
                onChange={handleInputChange}
              ></textarea>
            </label>
            <div className="profile-form-actions">
              <button className="btn primary" type="submit">
                Save changes
              </button>
              <button
                className="btn ghost"
                type="button"
                data-profile-cancel
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="btn ghost"
                type="button"
                data-profile-reset
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </form>
          <div className="profile-counts">
            <span>
              <strong>Works</strong>{" "}
              <span data-profile-count="works">{profile.counts.works}</span>
            </span>
            <span>
              <strong>Followers</strong>{" "}
              <span data-profile-count="followers">{profile.counts.followers}</span>
            </span>
          </div>
          <div className="profile-actions">
            <button
              className="btn"
              type="button"
              data-profile-edit
              onClick={handleEditClick}
              disabled={!isAuthenticated}
            >
              Edit profile
            </button>
            <button className="btn glow-danger" type="button" data-profile-share>
              Share profile
            </button>
            {isAuthenticated ? (
              <button className="btn ghost" type="button" onClick={handleSignOut}>
                Sign out
              </button>
            ) : null}
          </div>
          <p className="profile-status" data-profile-status>
            {statusMessage}
          </p>
        </div>
        {!isAuthenticated ? (
          <div className="profile-auth-overlay" data-auth-overlay>
            <div className="profile-auth-window">
              <p className="auth-eyebrow">Welcome to PensUp</p>
              <h2>{authMode === "signin" ? "Sign in" : "Create account"}</h2>
              <div className="auth-grid">
                <form
                  className="auth-card"
                  data-auth-form="signin"
                  data-auth-panel="signin"
                  hidden={authMode !== "signin"}
                  onSubmit={handleAuthSubmit}
                >
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
                    <button
                      className="btn ghost glow-danger"
                      type="button"
                      data-auth-toggle="signup"
                      onClick={() => handleAuthToggle("signup")}
                    >
                      Create account
                    </button>
                  </div>
                </form>
                <form
                  className="auth-card"
                  data-auth-form="signup"
                  data-auth-panel="signup"
                  hidden={authMode !== "signup"}
                  onSubmit={handleAuthSubmit}
                >
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
                    <button
                      className="btn ghost"
                      type="button"
                      data-auth-toggle="signin"
                      onClick={() => handleAuthToggle("signin")}
                    >
                      Back to sign in
                    </button>
                  </div>
                </form>
              </div>
              <p className="auth-status" data-auth-status>
                {authStatus || "Sign in to edit your profile details."}
              </p>
            </div>
          </div>
        ) : null}
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
