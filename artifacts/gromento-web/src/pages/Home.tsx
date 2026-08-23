import { Hero } from "@/sections/Hero";
import { Usp } from "@/sections/Usp";
import { Positioning } from "@/sections/Positioning";
import { Difference } from "@/sections/Difference";
import { CoreMessage } from "@/sections/CoreMessage";
import { CtaBand } from "@/components/CtaBand";

/** The overview: the pitch, the advantage, the system, the message. */
export function Home() {
  return (
    <>
      <Hero />
      <Usp />
      <Positioning />
      <Difference />
      <CoreMessage />
      <CtaBand />
    </>
  );
}
