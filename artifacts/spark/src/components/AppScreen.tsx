import { useEffect, useState, type ReactNode } from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Logo } from "@/components/ui";
import { cn } from "@/lib/utils";

/** Matches a media query, re-rendering when it flips. */
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/**
 * Renders an app surface full-bleed on phones and inside a device bezel on
 * desktop. The screen is mounted once either way, so there is no duplicated
 * DOM for forms and labels to fight over.
 */
export function AppScreen({
  children,
  footer,
  className,
}: {
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  if (!isDesktop) {
    return (
      <div className={cn("flex min-h-dvh flex-col bg-cream", className)}>
        <div className="flex-1">{children}</div>
        {footer ? (
          <div className="sticky bottom-0 border-t border-ink-900/10 bg-white/95 p-4 backdrop-blur">
            {footer}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-ink-900/95">
      <div className="flex justify-center pt-8 pb-4">
        <Link href="/" aria-label="SPARK home">
          <Logo tone="light" />
        </Link>
      </div>
      <div className="flex justify-center pb-12">
        <PhoneFrame>
          <div className={cn("flex h-[720px] flex-col bg-cream pt-11", className)}>
            <div className="no-scrollbar flex-1 overflow-y-auto">{children}</div>
            {footer ? (
              <div className="border-t border-ink-900/10 bg-white p-4">{footer}</div>
            ) : null}
          </div>
        </PhoneFrame>
      </div>
    </div>
  );
}

export function AppHeader({
  title,
  subtitle,
  onBack,
  backHref,
  right,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backHref?: string;
  right?: ReactNode;
}) {
  const backButton = (
    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white ring-1 ring-ink-900/10">
      <ArrowLeft className="size-4" aria-hidden />
    </span>
  );

  return (
    <div className="flex items-center gap-3 px-5 pt-4 pb-3">
      {onBack ? (
        <button type="button" onClick={onBack} aria-label="Go back">
          {backButton}
        </button>
      ) : (
        <Link href={backHref ?? "/"} aria-label="Go back">
          {backButton}
        </Link>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-bold">{title}</h1>
        {subtitle ? <p className="truncate text-xs text-ink-400">{subtitle}</p> : null}
      </div>
      {right}
    </div>
  );
}

export function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex gap-1.5 px-5 pb-4" aria-label={`Step ${step + 1} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-1 flex-1 rounded-full transition-colors",
            i <= step ? "bg-brand-600" : "bg-ink-900/10",
          )}
        />
      ))}
    </div>
  );
}
