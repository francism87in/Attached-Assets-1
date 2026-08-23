import { Route, Switch, useLocation } from "wouter";
import { Backdrop, ScrollProgress } from "@/components/Backdrop";
import { Grain } from "@/components/Grain";
import { PageTransition } from "@/components/PageTransition";
import { Nav } from "@/sections/Nav";
import { Footer } from "@/sections/Footer";
import { Home } from "@/pages/Home";
import { Approach } from "@/pages/Approach";
import { WhatWeDo } from "@/pages/WhatWeDo";
import { Markets } from "@/pages/Markets";
import { WhyGromento } from "@/pages/WhyGromento";
import { Contact } from "@/pages/Contact";
import { NotFound } from "@/pages/NotFound";

export default function App() {
  const [location] = useLocation();

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[70] focus:rounded-full focus:bg-lime focus:px-5 focus:py-3 focus:font-display focus:text-sm focus:font-semibold focus:text-ink"
      >
        Skip to content
      </a>

      <Backdrop />
      <Grain />
      <ScrollProgress />
      <Nav />

      <main id="main">
        <PageTransition location={location}>
          <Switch location={location}>
            <Route path="/" component={Home} />
            <Route path="/approach" component={Approach} />
            <Route path="/what-we-do" component={WhatWeDo} />
            <Route path="/nri-markets" component={Markets} />
            <Route path="/why-gromento" component={WhyGromento} />
            <Route path="/contact" component={Contact} />
            <Route component={NotFound} />
          </Switch>
        </PageTransition>
      </main>

      <Footer />
    </>
  );
}
