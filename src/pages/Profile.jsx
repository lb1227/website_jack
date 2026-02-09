import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { creatorProfileById } from "../data/creatorProfiles.js";

const STORAGE_KEY = "pensup.profile";
const AUTH_KEY = "pensup.authenticated";
const ACCOUNTS_KEY = "pensup.accounts";
const PROFILE_TYPE_KEY = "pensup.profileType";
const AUTHOR_APPROVED_KEY = "pensup.authorApproved";
const MAX_IMAGE_BYTES = 800 * 1024;
const EMPTY_PROFILE = {
  name: "Username",
  tags: "empty · empty · empty",
  bio: "Nothing here yet:(",
  avatar: "",
  background: "",
  counts: {
    works: 0,
    followers: 0,
    subscribers: 0,
    following: 0,
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

const safeSetItem = (key, value) => {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch (error) {
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      return false;
    }
    throw error;
  }
};

const persistProfile = (profile) => {
  if (typeof window === "undefined") {
    return { stored: false, reduced: false };
  }
  const serialized = JSON.stringify(profile);
  if (safeSetItem(STORAGE_KEY, serialized)) {
    return { stored: true, reduced: false };
  }
  const trimmedProfile = {
    ...profile,
    avatar: "",
    background: "",
  };
  const trimmedSerialized = JSON.stringify(trimmedProfile);
  if (safeSetItem(STORAGE_KEY, trimmedSerialized)) {
    return { stored: true, reduced: true };
  }
  return { stored: false, reduced: true };
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
  safeSetItem(ACCOUNTS_KEY, JSON.stringify(accounts));
};

export default function Profile() {
  const location = useLocation();
  const { creatorId } = useParams();
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [formValues, setFormValues] = useState(EMPTY_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authStatus, setAuthStatus] = useState("");
  const [authMode, setAuthMode] = useState("signin");
  const [profileType, setProfileType] = useState("reader");
  const [isAuthorApproved, setIsAuthorApproved] = useState(false);
  const avatarInputRef = useRef(null);
  const backgroundInputRef = useRef(null);
  const creatorProfile = useMemo(() => creatorProfileById(creatorId), [creatorId]);
  const isViewingCreator = Boolean(creatorId && creatorProfile);

  useEffect(() => {
    const stored = loadProfile();
    setProfile(stored);
    setFormValues(stored);
    if (typeof window !== "undefined") {
      setIsAuthenticated(window.localStorage.getItem(AUTH_KEY) === "true");
      const savedType = window.localStorage.getItem(PROFILE_TYPE_KEY);
      const savedApproval = window.localStorage.getItem(AUTHOR_APPROVED_KEY);
      if (savedType === "author" || savedType === "reader") {
        setProfileType(savedType);
      }
      if (savedApproval === "true") {
        setIsAuthorApproved(true);
      }
    }
  }, []);

  useEffect(() => {
    if (!isViewingCreator) {
      return;
    }
    setIsEditing(false);
    setProfileType("author");
    setIsAuthorApproved(true);
    setStatus("");
  }, [isViewingCreator]);

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

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    safeSetItem(PROFILE_TYPE_KEY, profileType);
  }, [profileType]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    safeSetItem(AUTHOR_APPROVED_KEY, String(isAuthorApproved));
  }, [isAuthorApproved]);

  useEffect(() => {
    if (profileType === "author" && !isAuthorApproved) {
      setProfileType("reader");
      setStatus("Author profiles require approval. Toggle approval to preview it.");
    }
  }, [isAuthorApproved, profileType]);

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

  const profileContext = useMemo(() => {
    if (profileType === "author") {
      return {
        label: "Author profile",
        description: "Showcase works and connect with subscribers.",
        counts: [
          { key: "works", label: "Works" },
          { key: "followers", label: "Followers" },
          { key: "subscribers", label: "Subscribers" },
        ],
        categories: [
          {
            id: "works",
            title: "Works",
            feedTitle: "Works",
            feedDescription: "Publish new chapters or collections to keep your reader feed fresh.",
            feedBody: "No new releases yet. Publish a chapter or collection to spark activity.",
          },
          {
            id: "feed",
            title: "Feed",
            feedTitle: "Feed",
            feedDescription: "Share quick updates and jump into live community threads.",
            feedBody: "The chatroom is quiet. Start a new prompt to welcome readers.",
          },
          {
            id: "public-comments",
            title: "Public Comments",
            feedTitle: "Public Comments",
            feedDescription: "Share quick updates and jump into live community threads.",
            feedBody: "The chatroom is quiet. Start a new prompt to welcome readers.",
          },
        ],
      };
    }
    return {
      label: "Reader profile",
      description: "Track who you follow and join reader conversations.",
      counts: [
        { key: "followers", label: "Followers" },
        { key: "following", label: "Following" },
      ],
      categories: [
        {
          id: "feed",
          title: "Feed",
          feedTitle: "Feed",
          feedDescription: "Stay up to date on the creators and stories you love.",
          feedBody: "Follow creators to see their updates show up here.",
        },
        {
          id: "public-comments",
          title: "Public Comments",
          feedTitle: "Public Comments",
          feedDescription: "Reader lounge for recommendations, reactions, and meetups.",
          feedBody: "Jump in to start a new conversation or respond to ongoing threads.",
        },
      ],
    };
  }, [profileType]);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    setActiveCategory(profileContext.categories[0] ?? null);
  }, [profileContext]);

  const handleEditClick = () => {
    if (isViewingCreator) {
      setStatus("Creator profiles are read-only.");
      return;
    }
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

  const handleAvatarClick = () => {
    if (!isEditing || isLocked) {
      return;
    }
    avatarInputRef.current?.click();
  };

  const handleImageUpload = (file, onLoad) => {
    if (!file) {
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setStatus("Image too large. Choose one under 800 KB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onLoad(reader.result?.toString() ?? "");
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    handleImageUpload(file, (dataUrl) => {
      setFormValues((current) => ({
        ...current,
        avatar: dataUrl,
      }));
      setStatus("Profile photo updated. Save changes to apply.");
    });
  };

  const handleBackgroundChange = (event) => {
    const file = event.target.files?.[0];
    handleImageUpload(file, (dataUrl) => {
      setFormValues((current) => ({
        ...current,
        background: dataUrl,
      }));
      setStatus("Background updated. Save changes to apply.");
    });
  };

  const handleClearBackground = () => {
    if (!isAuthenticated) {
      setAuthStatus("Sign in to update your background.");
      return;
    }
    setFormValues((current) => ({
      ...current,
      background: "",
    }));
    if (backgroundInputRef.current) {
      backgroundInputRef.current.value = "";
    }
    setStatus("Background cleared. Save changes to apply.");
  };

  const handleSave = (event) => {
    event.preventDefault();
    if (!isAuthenticated) {
      setAuthStatus("Sign in to save changes.");
      return;
    }
    setProfile(formValues);
    setFormValues(formValues);
    const { stored, reduced } = persistProfile(formValues);
    if (!stored) {
      setStatus("Profile saved locally. Some details may not persist due to storage limits.");
    } else if (reduced) {
      setStatus("Profile saved, but images were removed to fit browser storage limits.");
    } else {
      setStatus("Profile updated.");
    }
    setIsEditing(false);
    if (avatarInputRef.current) {
      avatarInputRef.current.value = "";
    }
    if (backgroundInputRef.current) {
      backgroundInputRef.current.value = "";
    }
  };

  const handleCancel = () => {
    setFormValues(profile);
    setIsEditing(false);
    setStatus("Edits discarded.");
    if (avatarInputRef.current) {
      avatarInputRef.current.value = "";
    }
    if (backgroundInputRef.current) {
      backgroundInputRef.current.value = "";
    }
  };

  const handleReset = () => {
    if (!isAuthenticated) {
      setAuthStatus("Sign in to reset your profile.");
      return;
    }
    if (avatarInputRef.current) {
      avatarInputRef.current.value = "";
    }
    if (backgroundInputRef.current) {
      backgroundInputRef.current.value = "";
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
    const { reduced } = persistProfile(nextProfile);
    if (reduced) {
      setStatus("Profile saved, but images were removed to fit browser storage limits.");
    }
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

  const displayProfile = isViewingCreator ? creatorProfile : profile;
  const isLocked = !isAuthenticated || isViewingCreator;
  const activeAvatar = isEditing ? formValues.avatar : displayProfile?.avatar;
  const activeBackground = isEditing ? formValues.background : displayProfile?.background;
  const countsToDisplay = profileContext.counts;
  const heroStyle = activeBackground
    ? {
        backgroundImage: `url(${activeBackground})`,
      }
    : undefined;
  const selectedCategory = activeCategory ?? profileContext.categories[0];
  const worksToShow = isViewingCreator ? creatorProfile?.works ?? [] : [];

  return (
    <main className="profile-page" id="profile">
      <section className="profile-hero">
        <div className="profile-hero-layout">
          <div
            className={`profile-hero-card ${isEditing ? "is-editing" : ""} ${
              isAuthenticated ? "" : "is-locked"
            } ${activeBackground ? "has-background" : ""}`.trim()}
            style={heroStyle}
            data-profile-hero
          >
            <button
              className={`profile-avatar ${isEditing ? "is-editable" : ""}`.trim()}
              type="button"
              data-profile-avatar
              aria-label="Update profile photo"
              disabled={isLocked || !isEditing}
              onClick={handleAvatarClick}
            >
              <img
                data-profile-avatar-image
                alt="Profile photo"
                src={activeAvatar || undefined}
                hidden={!activeAvatar}
              />
              <span className="profile-avatar-overlay" aria-hidden="true">
                <svg
                  className="profile-avatar-icon"
                  viewBox="0 0 24 24"
                  role="presentation"
                  focusable="false"
                >
                  <path
                    d="M3 17.25V21h3.75l11.1-11.1-3.75-3.75L3 17.25Zm17.71-10.04c.39-.39.39-1.02 0-1.41l-2.51-2.51a1 1 0 0 0-1.41 0l-1.96 1.96 3.75 3.75 2.13-2.13Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
            </button>
            <input
              ref={avatarInputRef}
              className="profile-file-input"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              aria-label="Upload profile photo"
              disabled={isLocked || !isEditing}
            />
            {!isEditing ? (
              <div className="profile-summary" data-profile-summary>
                <h1 className="profile-summary-name" data-profile-display="name">
                  {displayProfile?.name}
                </h1>
                <p className="profile-summary-type">{profileContext.label}</p>
                <p className="profile-summary-tags" data-profile-display="tags">
                  {displayProfile?.tags}
                </p>
                <p className="profile-summary-bio" data-profile-display="bio">
                  {displayProfile?.bio}
                </p>
                <p className="profile-summary-context">{profileContext.description}</p>
                {isViewingCreator ? (
                  <p className="profile-summary-context">
                    Viewing {displayProfile?.name}&apos;s creator profile.
                  </p>
                ) : null}
              </div>
            ) : null}
            {isEditing ? (
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
                <label className="profile-inline-field">
                  <span>Profile background</span>
                  <input
                    ref={backgroundInputRef}
                    type="file"
                    name="background"
                    accept="image/*"
                    onChange={handleBackgroundChange}
                    disabled={isLocked}
                  />
                  <span className="profile-inline-hint">
                    This background is stored locally in your browser.
                  </span>
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
                  <button
                    className="btn ghost"
                    type="button"
                    onClick={handleClearBackground}
                    disabled={isLocked}
                  >
                    Clear background
                  </button>
                </div>
              </form>
            ) : null}
            <div className="profile-counts">
              {countsToDisplay.map((count) => (
                <span key={count.key}>
                  <strong>{count.label}</strong>{" "}
                  <span data-profile-count={count.key}>
                    {displayProfile?.counts?.[count.key] ?? 0}
                  </span>
                </span>
              ))}
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
              <button
                className="btn glow-danger"
                type="button"
                data-profile-share
                disabled={isLocked}
              >
                Share profile
              </button>
            </div>
            <p className="profile-status" data-profile-status>
              {isViewingCreator ? "Creator profile preview." : statusMessage}
            </p>
          </div>
        </div>
        {!isAuthenticated && !isViewingCreator ? (
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

      {worksToShow.length ? (
        <section className="profile-series" data-profile-series>
          <div className="section-header">
            <h2>Featured works</h2>
          </div>
          <div className="series-grid" data-series-grid>
            {worksToShow.map((work) => (
              <article className="series-card" key={work.title}>
                <img src={work.cover} alt="" />
                <div>
                  <p className="series-meta">{work.status}</p>
                  <strong>{work.title}</strong>
                  <p className="profile-summary-context">{work.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="profile-categories" data-profile-categories>
        <div className="section-header">
          <h2>{profileType === "author" ? "Author" : "Reader"} spaces</h2>
        </div>
        <div className="profile-category-grid">
          {profileContext.categories.map((category) => (
            <button
              className={`profile-category-card ${
                selectedCategory?.id === category.id ? "is-active" : ""
              }`.trim()}
              type="button"
              key={category.id}
              aria-pressed={selectedCategory?.id === category.id}
              onClick={() => setActiveCategory(category)}
            >
              <h3>{category.title}</h3>
              {category.description ? <p>{category.description}</p> : null}
            </button>
          ))}
        </div>
      </section>

      <section className="profile-feed">
        <div className="section-header">
          <h2>{selectedCategory?.feedTitle ?? "Feed"}</h2>
          <p className="feed-description">
            {selectedCategory?.feedDescription ?? "Select a category to view its updates."}
          </p>
        </div>
        <article className="feed-card">
          <div className="feed-body">
            <p>{selectedCategory?.feedBody ?? "Choose a category to see updates here."}</p>
          </div>
          <div className="feed-media"></div>
        </article>
      </section>
      <nav className="profile-bottom-nav" aria-label="Development toggles">
        <div className="profile-dev-toggle" aria-live="polite">
          <p className="profile-dev-label">Development toggles</p>
          <div className="profile-dev-actions">
            <button
              className="btn ghost"
              type="button"
              onClick={() => {
                setProfileType((current) => (current === "author" ? "reader" : "author"));
              }}
              disabled={!isAuthorApproved && profileType !== "author"}
            >
              Switch to {profileType === "author" ? "reader" : "author"}
            </button>
            <button
              className="btn ghost"
              type="button"
              onClick={() => {
                setIsAuthorApproved((current) => !current);
              }}
            >
              {isAuthorApproved ? "Revoke author approval" : "Grant author approval"}
            </button>
          </div>
          <p className="profile-dev-status">
            Author approval: {isAuthorApproved ? "Approved" : "Required"}
          </p>
        </div>
      </nav>
    </main>
  );
}
