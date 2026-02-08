import React, { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [searchQuery, setSearchQuery] = useState("");

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
            <a href="#leaderboard">Leaderboard</a>
            <NavLink to="/profile">My Profile</NavLink>
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
          <Link className="btn glow-danger logout-button" to="/login">
            Sign in
          </Link>
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
    </>
  );
}
