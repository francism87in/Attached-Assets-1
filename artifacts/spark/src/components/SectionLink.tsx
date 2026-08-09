import { useCallback, type ComponentProps } from "react";
import { useLocation } from "wouter";

/**
 * Scrolls to a landing-page section, navigating home first when we're on
 * another route. Plain `href="/#id"` anchors would force a full reload off the
 * landing page, and break entirely under hash-based routing.
 */
export function useScrollToSection() {
  const [location, navigate] = useLocation();

  return useCallback(
    (id: string) => {
      const scroll = () =>
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

      if (location === "/") {
        scroll();
        return;
      }
      navigate("/");
      // Let the landing page mount before looking for the section.
      window.requestAnimationFrame(() => window.setTimeout(scroll, 60));
    },
    [location, navigate],
  );
}

export function SectionLink({
  section,
  onClick,
  children,
  ...props
}: Omit<ComponentProps<"a">, "href"> & { section: string }) {
  const scrollTo = useScrollToSection();

  return (
    <a
      href={`#${section}`}
      onClick={(e) => {
        e.preventDefault();
        onClick?.(e);
        scrollTo(section);
      }}
      {...props}
    >
      {children}
    </a>
  );
}
