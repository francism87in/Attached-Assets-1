import { Link } from "wouter";
import { Star } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------- Button */

type ButtonVariant = "primary" | "spark" | "outline" | "ghost" | "dark";
type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-600/25",
  spark: "bg-spark-400 text-ink-900 hover:bg-spark-300 shadow-sm shadow-spark-500/30",
  outline: "border border-ink-900/15 bg-white text-ink-900 hover:border-ink-900/35",
  ghost: "text-ink-900 hover:bg-ink-900/5",
  dark: "bg-ink-900 text-white hover:bg-ink-600",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[0.95rem]",
  lg: "h-13 px-7 text-base",
};

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors " +
  "disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-brand-600";

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return (
    <button className={cn(buttonBase, variants[variant], sizes[size], className)} {...props} />
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<"a"> & { href: string; variant?: ButtonVariant; size?: ButtonSize }) {
  return (
    <Link
      href={href}
      className={cn(buttonBase, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

/* ----------------------------------------------------------------- Badge */

export function Badge({
  children,
  className,
  icon: Icon,
}: {
  children: ReactNode;
  className?: string;
  icon?: React.ElementType;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        "bg-white text-ink-600 ring-1 ring-ink-900/10",
        className,
      )}
    >
      {Icon ? <Icon className="size-3.5" aria-hidden /> : null}
      {children}
    </span>
  );
}

/* --------------------------------------------------------------- Section */

export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn("scroll-mt-24 py-16 sm:py-24", className)}>
      <div className="shell">{children}</div>
    </section>
  );
}

export function SectionHead({
  eyebrow,
  title,
  body,
  align = "left",
  tone = "light",
}: {
  eyebrow?: string;
  title: ReactNode;
  body?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        tone === "dark" ? "text-white" : "text-ink-900",
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "mb-3 text-xs font-bold tracking-[0.18em] uppercase",
            tone === "dark" ? "text-spark-400" : "text-brand-600",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl leading-[1.1] font-extrabold sm:text-4xl md:text-[2.75rem]">
        {title}
      </h2>
      {body ? (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed sm:text-lg",
            tone === "dark" ? "text-white/70" : "text-ink-400",
          )}
        >
          {body}
        </p>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------ StarRating */

export function StarRating({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            "size-4",
            i <= Math.round(value) ? "fill-spark-500 text-spark-500" : "text-ink-900/20",
          )}
          aria-hidden
        />
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ Logo */

export function Logo({
  tone = "dark",
  className,
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="grid size-8 place-items-center rounded-xl bg-brand-600 text-spark-400">
        <svg viewBox="0 0 24 24" className="size-4.5" fill="currentColor" aria-hidden>
          <path d="M13.5 2 4 13.2h6.1L9.6 22 20 10.4h-6.6L13.5 2Z" />
        </svg>
      </span>
      <span
        className={cn(
          "font-display text-xl font-extrabold tracking-tight",
          tone === "dark" ? "text-ink-900" : "text-white",
        )}
      >
        spark
      </span>
    </span>
  );
}
