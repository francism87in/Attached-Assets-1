import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { App } from "@/App";
import { BookingsProvider } from "@/store/bookings";
import { PrefsProvider } from "@/store/prefs";
import "@/index.css";

const container = document.getElementById("root");
if (!container) throw new Error("Root element #root not found");

// Single-file builds (VITE_HASH_ROUTER=1) are opened from static hosts and
// sandboxed frames where pushState routing can't be relied on.
const hashRouting = import.meta.env.VITE_HASH_ROUTER === "1";

createRoot(container).render(
  <StrictMode>
    <PrefsProvider>
      <BookingsProvider>
        {hashRouting ? (
          <Router hook={useHashLocation}>
            <App />
          </Router>
        ) : (
          <App />
        )}
      </BookingsProvider>
    </PrefsProvider>
  </StrictMode>,
);
