import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Artwork block. The image drifts slightly against the scroll so it reads as a
 * plate set into the page rather than a static picture, and an optional caption
 * carries the point the image is making.
 *
 * Art is original SVG built for this site — no stock photography — so it scales
 * losslessly, weighs a few KB, and stays on brand at any size.
 */
export function Figure({
  src,
  alt,
  caption,
  className,
  imageClassName,
  parallax = true,
}: {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  imageClassName?: string;
  parallax?: boolean;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);

  return (
    <figure ref={ref} className={cn("relative", className)}>
      <div className="overflow-hidden rounded-2xl border border-fg/10 bg-surface-raised">
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          style={reduced || !parallax ? undefined : { y }}
          className={cn("w-full", imageClassName)}
        />
      </div>
      {caption ? (
        <figcaption className="mt-3 text-sm text-fg-muted">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
