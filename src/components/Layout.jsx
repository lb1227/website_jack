import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import ChatOverlay from "./ChatOverlay.jsx";

const AUTH_KEY = "pensup.authenticated";
const PROFILE_KEY = "pensup.profile";
const INTRO_MODAL_KEY = "pensup.introSeen";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isWaffleOpen, setIsWaffleOpen] = useState(false);
  const [isIntroModalOpen, setIsIntroModalOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const setAuthFromStorage = () => {
      setIsAuthenticated(window.localStorage.getItem(AUTH_KEY) === "true");
    };
    setAuthFromStorage();
    const handleAuthEvent = (event) => {
      if (typeof event?.detail?.authenticated === "boolean") {
        setIsAuthenticated(event.detail.authenticated);
        return;
      }
      setAuthFromStorage();
    };
    window.addEventListener("pensup-auth", handleAuthEvent);
    return () => window.removeEventListener("pensup-auth", handleAuthEvent);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const introSeen = window.localStorage.getItem(INTRO_MODAL_KEY) === "true";
    if (!introSeen) {
      setIsIntroModalOpen(true);
    }
  }, []);

  useEffect(() => {
    const closeMenu = (event) => {
      if (!menuRef.current || menuRef.current.contains(event.target)) {
        return;
      }
      setIsWaffleOpen(false);
    };

    const closeMenuOnEscape = (event) => {
      if (event.key === "Escape") {
        setIsWaffleOpen(false);
      }
    };

    document.addEventListener("mousedown", closeMenu);
    document.addEventListener("keydown", closeMenuOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeMenu);
      document.removeEventListener("keydown", closeMenuOnEscape);
    };
  }, []);

  useEffect(() => {
    setIsWaffleOpen(false);
  }, [location.pathname]);

  const handleAuthClick = () => {
    if (isAuthenticated) {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(AUTH_KEY, "false");
        window.localStorage.removeItem(PROFILE_KEY);
        window.dispatchEvent(
          new CustomEvent("pensup-auth", { detail: { authenticated: false } }),
        );
        window.location.reload();
      }
      setIsAuthenticated(false);
      setIsWaffleOpen(false);
      return;
    }
    navigate("/profile", { state: { authMode: "signin" } });
  };

  const handleIntroDismiss = () => {
    setIsIntroModalOpen(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(INTRO_MODAL_KEY, "true");
    }
  };

  return (
    <>
      <header className="site-header">
        <div className="header-left">
          <Link className="logo-button" to="/">
            <span className="logo-mark">✒</span>
            <span className="logo-text">PensUp</span>
          </Link>
        </div>
        <div className="header-center">
          <nav className="main-nav">
            <NavLink to="/">Explore</NavLink>
            <NavLink to="/feed">Feed</NavLink>
            <NavLink to="/leaderboard">Leaderboard</NavLink>
            <NavLink to="/profile">My Profile</NavLink>
            <NavLink className="nav-cta" to="/publish">
              Publish
            </NavLink>
          </nav>
        </div>
        <div className="header-right">
          {isHome ? (
            <div className="search" data-search>
              <span className="icon"></span>
              <input
                type="text"
                placeholder="Titles, genres, creators"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>
          ) : null}
          {isAuthenticated ? (
            <div className="waffle-menu" ref={menuRef}>
              <button
                aria-expanded={isWaffleOpen}
                aria-haspopup="menu"
                aria-label="Open account menu"
                className="waffle-button"
                onClick={() => setIsWaffleOpen((currentValue) => !currentValue)}
                type="button"
              >
                <span className="waffle-icon" aria-hidden="true">
                  ⠿
                </span>
              </button>

              {isWaffleOpen ? (
                <div className="waffle-dropdown" role="menu">
                  <NavLink role="menuitem" to="/lists">
                    Lists
                  </NavLink>
                  <NavLink role="menuitem" to="/bookmarks">
                    Bookmarks
                  </NavLink>
                  <NavLink role="menuitem" to="/history">
                    History
                  </NavLink>
                  <button className="waffle-signout" onClick={handleAuthClick} role="menuitem" type="button">
                    Sign out
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <button className="btn glow-danger logout-button" type="button" onClick={handleAuthClick}>
              Sign in
            </button>
          )}
        </div>
      </header>

      {isIntroModalOpen ? (
        <div className="intro-modal-backdrop" role="presentation" onClick={handleIntroDismiss}>
          <div
            aria-labelledby="intro-modal-title"
            aria-modal="true"
            className="intro-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <h2 id="intro-modal-title">Welcome to PensUp</h2>
            <p>
              PensUp is a story discovery platform where readers can explore trending fiction, follow
              favorite creators, and support premium releases.
            </p>
            <p>
              <strong>Our mission:</strong> help great storytellers grow sustainable careers while giving
              readers a richer, community-driven reading experience.
            </p>
            <button className="btn glow-danger intro-modal-button" onClick={handleIntroDismiss} type="button">
              Got it
            </button>
          </div>
        </div>
      ) : null}

      <Outlet context={{ searchQuery }} />

      <footer className="site-footer">
        <div>
          <strong>PensUp</strong>
          <p>Where curated storytelling meets binge culture.</p>
        </div>
        <div className="footer-links">
          <a href="#">FAQ</a>
          <a href="#">Creator Guidelines</a>
          <a href="#">Support</a>
          <a href="#">Jobs</a>
        </div>
      </footer>
      <ChatOverlay />
    </>
  );
}
