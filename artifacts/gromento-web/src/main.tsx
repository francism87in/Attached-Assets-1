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
 *
 * When the site is served from a subpath rather than a domain root — a GitHub
 * Pages project site is `/<repo>/` — every route has to be resolved relative to
 * it. Vite substitutes `BASE_URL` from the `base` it was built with, so the
 * router's base follows the build instead of being hardcoded per host. Hash
 * routing already lives entirely after the `#`, so it needs no base.
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

// "/" -> "", "/Attached-Assets-1/" -> "/Attached-Assets-1"
const routerBase = import.meta.env.BASE_URL.replace(/\/+$/, "");

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element #root was not found in index.html");
}

createRoot(container).render(
  <StrictMode>
    <Router
      base={embedded ? undefined : routerBase}
      hook={embedded ? useHashLocation : undefined}
    >
      <App />
    </Router>
  </StrictMode>,
);
