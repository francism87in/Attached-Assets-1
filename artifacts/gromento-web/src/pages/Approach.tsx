import { PageHeader } from "@/components/PageHeader";
import { Difference } from "@/sections/Difference";
import { ContentEngine } from "@/sections/ContentEngine";
import { Philosophy } from "@/sections/Philosophy";
import { CtaBand } from "@/components/CtaBand";
import { routeFor } from "@/routes";

/** How demand gets built: the full chain, the questions content answers, the philosophy. */
export function Approach() {
  return (
    <>
      <PageHeader route={routeFor("/approach")} />
      <Difference headless />
      <ContentEngine variant="questions" />
      <Philosophy />
      <CtaBand />
    </>
  );
}
