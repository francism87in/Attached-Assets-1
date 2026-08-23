import { Backdrop, ScrollProgress } from "@/components/Backdrop";
import { Nav } from "@/sections/Nav";
import { Hero } from "@/sections/Hero";
import { Usp } from "@/sections/Usp";
import { Positioning } from "@/sections/Positioning";
import { Difference } from "@/sections/Difference";
import { ContentEngine } from "@/sections/ContentEngine";
import { Services } from "@/sections/Services";
import { Markets } from "@/sections/Markets";
import { Developers } from "@/sections/Developers";
import { Philosophy } from "@/sections/Philosophy";
import { Why } from "@/sections/Why";
import { CoreMessage } from "@/sections/CoreMessage";
import { Closing } from "@/sections/Closing";
import { Footer } from "@/sections/Footer";

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-50 focus:rounded-full focus:bg-lime focus:px-5 focus:py-3 focus:font-display focus:text-sm focus:font-semibold focus:text-ink"
      >
        Skip to content
      </a>

      <Backdrop />
      <ScrollProgress />
      <Nav />

      <main id="main">
        <Hero />
        <Usp />
        <Positioning />
        <Difference />
        <ContentEngine />
        <Services />
        <Markets />
        <Developers />
        <Philosophy />
        <Why />
        <CoreMessage />
        <Closing />
      </main>

      <Footer />
    </>
  );
}
