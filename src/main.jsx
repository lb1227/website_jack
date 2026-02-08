import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles.css";

const baseUrl = import.meta.env.BASE_URL;
const normalizedBaseUrl = baseUrl === "./" ? "/" : baseUrl;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter basename={normalizedBaseUrl}>
      <App />
    </HashRouter>
  </React.StrictMode>
);
