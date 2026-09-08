import { ButtonLink, Section } from "@/components/ui";

export function NotFound() {
  return (
    <Section className="text-center">
      <p className="font-display text-6xl font-extrabold text-brand-600">404</p>
      <h1 className="mt-4 text-3xl font-extrabold">This page went out on a booking</h1>
      <p className="mx-auto mt-3 max-w-md text-ink-400">
        The link you followed doesn't exist in the prototype. Head back home, or start a booking.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <ButtonLink href="/">Go home</ButtonLink>
        <ButtonLink href="/book" variant="outline">
          Book a service
        </ButtonLink>
      </div>
    </Section>
  );
}
