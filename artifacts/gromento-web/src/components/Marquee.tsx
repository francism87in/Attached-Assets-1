import { useReducedMotion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Infinite ticker. The track is duplicated once and translated -50%, so the
 * loop is seamless; the animation is CSS-driven (compositor only) and pauses on
 * hover. Under reduced motion the list renders static and scrolls natively.
 */
export function Marquee({
  children,
  duration = 42,
  className,
  fade = true,
}: {
  children: ReactNode;
  duration?: number;
  className?: string;
  fade?: boolean;
}) {
  const reduced = useReducedMotion();

  return (
    <div
      className={cn(
        "relative flex overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        !reduced && "overflow-hidden",
        className,
      )}
      style={
        fade
          ? {
              maskImage:
                "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            }
          : undefined
      }
    >
      <div
        className={cn(
          "flex w-max shrink-0 items-center",
          !reduced && "marquee-track hover:[animation-play-state:paused]",
        )}
        style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
      >
        {children}
        {!reduced ? <span aria-hidden="true" className="contents">{children}</span> : null}
      </div>
    </div>
  );
}
