import { PageHeader } from "@/components/PageHeader";
import { Closing } from "@/sections/Closing";
import { routeFor } from "@/routes";

/** One job: get the brief. */
export function Contact() {
  return (
    <>
      <PageHeader route={routeFor("/contact")} />
      <Closing headless />
    </>
  );
}
