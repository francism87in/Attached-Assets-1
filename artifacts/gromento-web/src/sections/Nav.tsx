import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { brand, nav } from "@/data/site";
import { easeBrand } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function Nav() {
  const reduced = useReducedMotion();
  const [condensed, setCondensed] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setCondensed(latest > 40);
  });

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <motion.div
        initial={reduced ? false : { y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: easeBrand, delay: 0.1 }}
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 transition-all duration-300 lg:px-8",
          condensed ? "py-3" : "py-5",
        )}
      >
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-0 -z-10 border-b transition-all duration-300",
            condensed
              ? "border-white/10 bg-ink/70 backdrop-blur-xl"
              : "border-transparent bg-transparent",
          )}
        />

        <a href="#top" className="shrink-0" aria-label={`${brand.name} — home`}>
          <Logo />
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group relative font-display text-sm font-medium text-white/70 transition-colors duration-200 hover:text-white"
            >
              {item.label}
              <span
                aria-hidden="true"
                className="absolute -bottom-1.5 left-0 h-px w-0 bg-lime transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full"
              />
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button href="#contact" className="px-5 py-2.5 text-[0.8125rem]">
            Talk to Gromento
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-lime hover:text-lime lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </motion.div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: reduced ? 0 : 0.35, ease: easeBrand }}
            className="overflow-hidden border-b border-white/10 bg-ink/95 backdrop-blur-xl lg:hidden"
          >
            <nav aria-label="Primary mobile" className="flex flex-col gap-1 px-6 py-6">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 font-display text-base font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-lime"
                >
                  {item.label}
                </a>
              ))}
              <Button href="#contact" className="mt-3" onClick={() => setOpen(false)}>
                Talk to Gromento
              </Button>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
