import { PageHeader } from "@/components/PageHeader";
import { Why } from "@/sections/Why";
import { Positioning } from "@/sections/Positioning";
import { CtaBand } from "@/components/CtaBand";
import { routeFor } from "@/routes";

/** The case for Gromento: the six reasons, then what the partnership combines. */
export function WhyGromento() {
  return (
    <>
      <PageHeader route={routeFor("/why-gromento")} />
      <Why />
      <Positioning />
      <CtaBand />
    </>
  );
}
