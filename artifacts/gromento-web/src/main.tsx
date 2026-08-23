import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import App from "@/App";
import "@/index.css";

/**
 * Path routing (`/approach`) when the site is served normally — that's what
 * Cloudflare Pages gets, with `public/_redirects` sending every path to
 * index.html.
 *
 * Hash routing (`#/approach`) when the page is opened from a file or embedded
 * in a sandboxed iframe, where `history.pushState` either throws or would
 * navigate the host frame. Same site, same routes, no server needed.
 */
const embedded =
  window.location.protocol === "file:" ||
  (() => {
    try {
      return window.self !== window.top;
    } catch {
      return true; // cross-origin frame — treat as embedded
    }
  })();

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element #root was not found in index.html");
}

createRoot(container).render(
  <StrictMode>
    <Router hook={embedded ? useHashLocation : undefined}>
      <App />
    </Router>
  </StrictMode>,
);
