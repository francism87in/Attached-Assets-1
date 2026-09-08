import { Hero } from "@/sections/Hero";
import { Usp } from "@/sections/Usp";
import { Difference } from "@/sections/Difference";
import { PageTeasers } from "@/components/PageTeasers";
import { CoreMessage } from "@/sections/CoreMessage";
import { CtaBand } from "@/components/CtaBand";

/**
 * The overview and the hub: the pitch, the advantage, the contrast that sets
 * Gromento apart, then a hand-off to the pages that own the detail.
 */
export function Home() {
  return (
    <>
      <Hero />
      <Usp />
      <Difference compact />
      <PageTeasers />
      <CoreMessage />
      <CtaBand />
    </>
  );
}
