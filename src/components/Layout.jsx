import React, { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import ChatOverlay from "./ChatOverlay.jsx";

const AUTH_KEY = "pensup.authenticated";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  const handleAuthClick = () => {
    if (isAuthenticated) {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(AUTH_KEY, "false");
        window.dispatchEvent(
          new CustomEvent("pensup-auth", { detail: { authenticated: false } }),
        );
      }
      setIsAuthenticated(false);
      return;
    }
    navigate("/profile", { state: { authMode: "signin" } });
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
        </div>
        <div className="header-right">
          <button className="btn glow-danger logout-button" type="button" onClick={handleAuthClick}>
            {isAuthenticated ? "Sign out" : "Sign in"}
          </button>
        </div>
      </header>

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
