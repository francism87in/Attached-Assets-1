import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Resolve a file from `public/` against the base the site was built for.
 *
 * A bare "/media/x.svg" is relative to the domain root, so it 404s wherever the
 * site is not served from one — a GitHub Pages project site lives at
 * `/<repo>/`. Vite substitutes BASE_URL at build time, so this follows the
 * build rather than assuming a host.
 */
export function asset(path: string) {
  return `${import.meta.env.BASE_URL.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}
