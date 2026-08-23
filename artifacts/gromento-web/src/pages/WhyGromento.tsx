import { PageHeader } from "@/components/PageHeader";
import { Usp } from "@/sections/Usp";
import { Why } from "@/sections/Why";
import { Positioning } from "@/sections/Positioning";
import { CoreMessage } from "@/sections/CoreMessage";
import { CtaBand } from "@/components/CtaBand";
import { routeFor } from "@/routes";

/** The case for Gromento: the advantage, the six reasons, the positioning. */
export function WhyGromento() {
  return (
    <>
      <PageHeader route={routeFor("/why-gromento")} />
      <Usp headless />
      <Why />
      <Positioning />
      <CoreMessage />
      <CtaBand />
    </>
  );
}
