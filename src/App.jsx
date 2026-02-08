import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Reading from "./pages/Reading.jsx";
import Profile from "./pages/Profile.jsx";
import Login from "./pages/Login.jsx";
import Publish from "./pages/Publish.jsx";
import Story from "./pages/Story.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/reading" element={<Reading />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/publish" element={<Publish />} />
        <Route path="/story" element={<Story />} />
      </Route>
    </Routes>
  );
}
