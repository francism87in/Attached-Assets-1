import { motion, useMotionTemplate, useMotionValue, useReducedMotion } from "motion/react";
import type { PointerEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Glass card with a pointer-tracked light source — the Glassmorphism treatment
 * from the design system, kept cheap by animating a single radial gradient.
 */
export function GlowCard({
  children,
  className,
  glow = "rgba(123,47,255,0.35)",
}: {
  children: ReactNode;
  className?: string;
  glow?: string;
}) {
  const reduced = useReducedMotion();
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const background = useMotionTemplate`radial-gradient(340px circle at ${x}px ${y}px, ${glow}, transparent 72%)`;

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reduced) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - bounds.left);
    y.set(event.clientY - bounds.top);
  }

  return (
    <div
      onPointerMove={handlePointerMove}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-fg/10 bg-fg/[0.03] backdrop-blur-sm transition-colors duration-300 hover:border-fg/20",
        className,
      )}
    >
      {!reduced ? (
        <motion.span
          aria-hidden="true"
          style={{ background }}
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      ) : null}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />
      <div className="relative">{children}</div>
    </div>
  );
}
