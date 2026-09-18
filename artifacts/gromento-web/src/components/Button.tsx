import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { MouseEvent, PointerEvent, ReactNode } from "react";
import { useLocation } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { springSnappy } from "@/lib/motion";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "group relative inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-6 py-3.5 font-display text-sm font-semibold tracking-tight transition-colors duration-200 disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-lime text-ink hover:bg-surface-raised",
  secondary:
    "border border-fg/15 bg-fg/[0.04] text-fg hover:border-accent/60 hover:text-accent",
  ghost: "text-fg/70 hover:text-accent",
};

/**
 * CTA with a magnetic pull: the button tracks the pointer within its bounds via
 * springs, and the arrow slides on hover. Pointer tracking is skipped entirely
 * when the visitor prefers reduced motion.
 */
export function Button({
  children,
  href,
  variant = "primary",
  className,
  withArrow = true,
  onClick,
  type = "button",
}: {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  className?: string;
  withArrow?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  const reduced = useReducedMotion();
  const [, navigate] = useLocation();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, springSnappy);
  const y = useSpring(pointerY, springSnappy);

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (reduced || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - (bounds.left + bounds.width / 2)) * 0.22);
    pointerY.set((event.clientY - (bounds.top + bounds.height / 2)) * 0.3);
  }

  /** Internal links navigate through the router; hashes and mailto fall through. */
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.();
    if (!href?.startsWith("/") || event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    navigate(href);
  }

  function reset() {
    pointerX.set(0);
    pointerY.set(0);
  }

  const content = (
    <>
      <span className="relative z-10">{children}</span>
      {withArrow ? (
        <ArrowUpRight
          className="relative z-10 h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      ) : null}
      {variant === "primary" ? (
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-lime opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-40"
        />
      ) : null}
    </>
  );

  const style = reduced ? undefined : { x, y };
  const shared = {
    className: cn(base, variants[variant], className),
    style,
    onPointerMove: handlePointerMove,
    onPointerLeave: reset,
    whileTap: reduced ? undefined : { scale: 0.97 },
  };

  if (href) {
    return (
      <motion.a {...shared} href={href} onClick={handleClick}>
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button {...shared} type={type} onClick={onClick}>
      {content}
    </motion.button>
  );
}
