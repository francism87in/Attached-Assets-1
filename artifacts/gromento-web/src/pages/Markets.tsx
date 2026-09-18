import { PageHeader } from "@/components/PageHeader";
import { Markets as MarketsSection } from "@/sections/Markets";
import { Developers } from "@/sections/Developers";
import { CtaBand } from "@/components/CtaBand";
import { routeFor } from "@/routes";

/** Geography-led: the markets, then the developers we build them for. */
export function Markets() {
  return (
    <>
      <PageHeader route={routeFor("/nri-markets")} />
      <MarketsSection headless />
      <Developers />
      <CtaBand />
    </>
  );
}
