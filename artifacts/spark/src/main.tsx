import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/App";
import { BookingsProvider } from "@/store/bookings";
import { PrefsProvider } from "@/store/prefs";
import "@/index.css";

const container = document.getElementById("root");
if (!container) throw new Error("Root element #root not found");

createRoot(container).render(
  <StrictMode>
    <PrefsProvider>
      <BookingsProvider>
        <App />
      </BookingsProvider>
    </PrefsProvider>
  </StrictMode>,
);
