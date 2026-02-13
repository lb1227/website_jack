import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Feed from "./pages/Feed.jsx";
import Publish from "./pages/Publish.jsx";
import Reading from "./pages/Reading.jsx";
import Profile from "./pages/Profile.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import Lists from "./pages/Lists.jsx";
import Bookmarks from "./pages/Bookmarks.jsx";
import History from "./pages/History.jsx";
import Coins from "./pages/Coins.jsx";
import Search from "./pages/Search.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/reading" element={<Reading />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/lists" element={<Lists />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/creator/:creatorId" element={<Profile />} />
        <Route path="/publish" element={<Publish />} />
        <Route path="/coins" element={<Coins />} />
        <Route path="/search" element={<Search />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
