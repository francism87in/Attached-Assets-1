import { cn } from "@/lib/utils";

/**
 * The Gromento mark: a lime `g` with the growth arrow breaking out of the bowl.
 * Per the brand kit, the arrow concept lives only in the `g` — never in the
 * rest of the wordmark.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={cn("h-8 w-8", className)} fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round">
        <circle cx={27} cy={29} r={11} />
        <path d="M38 29v13a9 9 0 0 1-9 9H23" />
        <path d="M35 22 48 9" />
        <path d="M39 9h9v9" />
      </g>
    </svg>
  );
}

/** Full lockup — the mark stands in for the `g`, exactly like the brand kit. */
export function Logo({
  className,
  markClassName,
  wordmarkClassName,
}: {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
}) {
  return (
    <span className={cn("flex items-center gap-1.5", className)}>
      <LogoMark className={cn("h-7 w-7 text-accent", markClassName)} />
      <span
        aria-hidden="true"
        className={cn(
          "font-display text-xl font-semibold tracking-tight text-fg",
          wordmarkClassName,
        )}
      >
        romento
      </span>
      <span className="sr-only">Gromento</span>
    </span>
  );
}
