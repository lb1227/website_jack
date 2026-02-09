import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

const STORAGE_KEY = "pensup.profile";
const AUTH_KEY = "pensup.authenticated";
const ACCOUNTS_KEY = "pensup.accounts";
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

const loadAccounts = () => {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const stored = window.localStorage.getItem(ACCOUNTS_KEY);
    if (!stored) {
      return [];
    }
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const persistAccounts = (accounts) => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
};

export default function Profile() {
  const location = useLocation();
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [formValues, setFormValues] = useState(EMPTY_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authStatus, setAuthStatus] = useState("");
  const [authMode, setAuthMode] = useState("signin");

  useEffect(() => {
    const stored = loadProfile();
    setProfile(stored);
    setFormValues(stored);
    if (typeof window !== "undefined") {
      setIsAuthenticated(window.localStorage.getItem(AUTH_KEY) === "true");
    }
  }, []);

  useEffect(() => {
    if (location.state?.authMode === "signin") {
      setAuthMode("signin");
      setAuthStatus("");
    }
  }, [location.state]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const handleAuthEvent = (event) => {
      if (typeof event?.detail?.authenticated === "boolean") {
        setIsAuthenticated(event.detail.authenticated);
        if (!event.detail.authenticated) {
          setIsEditing(false);
          setAuthMode("signin");
          setAuthStatus("Signed out. Sign in to continue.");
        }
      }
    };
    window.addEventListener("pensup-auth", handleAuthEvent);
    return () => window.removeEventListener("pensup-auth", handleAuthEvent);
  }, []);

  const broadcastAuth = (authenticated) => {
    if (typeof window === "undefined") {
      return;
    }
    window.dispatchEvent(new CustomEvent("pensup-auth", { detail: { authenticated } }));
  };

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

  const handleAuthSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const username = formData.get("signinUsername")?.toString().trim();
    const password = formData.get("signinPassword")?.toString();
    if (!username || !password) {
      setAuthStatus("Enter your username and password to sign in.");
      return;
    }
    const accounts = loadAccounts();
    const match = accounts.find(
      (account) => account.username === username && account.password === password,
    );
    if (!match) {
      setAuthStatus("Account not found. Create an account to continue.");
      return;
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem(AUTH_KEY, "true");
    }
    setIsAuthenticated(true);
    broadcastAuth(true);
    setAuthStatus("Welcome back! You can update your profile now.");
  };

  const handleCreateAccount = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const username = formData.get("createUsername")?.toString().trim();
    const password = formData.get("createPassword")?.toString();
    if (!username || !password) {
      setAuthStatus("Choose a username and password to create an account.");
      return;
    }
    const accounts = loadAccounts();
    const updatedAccounts = [...accounts.filter((account) => account.username !== username), {
      username,
      password,
    }];
    persistAccounts(updatedAccounts);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(AUTH_KEY, "true");
    }
    const nextProfile = {
      ...profile,
      name: username,
    };
    setProfile(nextProfile);
    setFormValues(nextProfile);
    persistProfile(nextProfile);
    setIsAuthenticated(true);
    broadcastAuth(true);
    setAuthStatus("Account created! You can update your profile now.");
  };

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(AUTH_KEY, "false");
    }
    setIsAuthenticated(false);
    setIsEditing(false);
    setAuthMode("signin");
    setAuthStatus("Signed out. Sign in to continue.");
    broadcastAuth(false);
  };

  const isLocked = !isAuthenticated;

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
            disabled={isLocked}
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
                disabled={isLocked}
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
                disabled={isLocked}
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
                disabled={isLocked}
              ></textarea>
            </label>
            <div className="profile-form-actions">
              <button className="btn primary" type="submit" disabled={isLocked}>
                Save changes
              </button>
              <button
                className="btn ghost"
                type="button"
                data-profile-cancel
                onClick={handleCancel}
                disabled={isLocked}
              >
                Cancel
              </button>
              <button
                className="btn ghost"
                type="button"
                data-profile-reset
                onClick={handleReset}
                disabled={isLocked}
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
              disabled={isLocked}
            >
              Edit profile
            </button>
            <button className="btn glow-danger" type="button" data-profile-share disabled={isLocked}>
              Share profile
            </button>
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
              {authMode === "signin" ? (
                <form className="auth-card" data-auth-form="signin" onSubmit={handleAuthSubmit}>
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
                      className="btn ghost"
                      type="button"
                      onClick={() => {
                        setAuthMode("create");
                        setAuthStatus("");
                      }}
                    >
                      Create account
                    </button>
                  </div>
                </form>
              ) : (
                <form className="auth-card" data-auth-form="create" onSubmit={handleCreateAccount}>
                  <h3>Create account</h3>
                  <label>
                    Username
                    <input
                      type="text"
                      name="createUsername"
                      autoComplete="username"
                      required
                      data-auth-input="create-username"
                    />
                  </label>
                  <label>
                    Password
                    <input
                      type="password"
                      name="createPassword"
                      autoComplete="new-password"
                      required
                      data-auth-input="create-password"
                    />
                  </label>
                  <div className="auth-card-actions">
                    <button className="btn" type="submit">
                      Create account
                    </button>
                    <button
                      className="btn ghost"
                      type="button"
                      onClick={() => {
                        setAuthMode("signin");
                        setAuthStatus("");
                      }}
                    >
                      Sign in
                    </button>
                  </div>
                </form>
              )}
              <p className="auth-status" data-auth-status>
                {authStatus ||
                  (authMode === "signin"
                    ? "Sign in to edit your profile details."
                    : "Create an account to unlock profile editing.")}
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
