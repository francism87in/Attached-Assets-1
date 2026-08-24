import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal, SplitText } from "@/components/Reveal";

/** Page section shell: consistent rhythm, max width and anchor target. */
export function Section({
  id,
  children,
  className,
  containerClassName,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  return (
    <section
      id={id}
      className={cn("relative scroll-mt-24 py-20 sm:py-24 lg:py-28", className)}
    >
      <div className={cn("mx-auto w-full max-w-6xl px-6 lg:px-8", containerClassName)}>
        {children}
      </div>
    </section>
  );
}

/** Eyebrow + headline pair. Numbering lives on page title cards, not here. */
export function SectionHeading({
  eyebrow,
  title,
  highlight,
  className,
  titleClassName,
  children,
}: {
  eyebrow: string;
  title: string;
  highlight?: readonly string[];
  className?: string;
  titleClassName?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <Reveal className="flex items-center gap-3">
        <span aria-hidden="true" className="h-px w-8 bg-lime" />
        <span className="eyebrow text-gray-cool">{eyebrow}</span>
        <span aria-hidden="true" className="h-px flex-1 bg-line" />
      </Reveal>
      <SplitText
        text={title}
        highlight={highlight}
        className={cn(
          "mt-6 text-balance text-3xl font-semibold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-5xl",
          titleClassName,
        )}
      />
      {children ? <div className="mt-6">{children}</div> : null}
    </div>
  );
}

/** Body paragraph with the site's muted tone. */
export function Lede({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-lg leading-relaxed text-gray-cool", className)}>{children}</p>
  );
}
