import { PageHeader } from "@/components/PageHeader";
import { Services } from "@/sections/Services";
import { ContentEngine } from "@/sections/ContentEngine";
import { CtaBand } from "@/components/CtaBand";
import { routeFor } from "@/routes";

/** The service surface, then the content engine that feeds it. */
export function WhatWeDo() {
  return (
    <>
      <PageHeader route={routeFor("/what-we-do")} />
      <Services headless />
      <ContentEngine />
      <CtaBand />
    </>
  );
}
