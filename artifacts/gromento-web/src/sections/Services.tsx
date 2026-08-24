import { motion, useReducedMotion } from "motion/react";
import {
  Camera,
  Flag,
  LayoutTemplate,
  Map,
  PlayCircle,
  Ticket,
  TrendingUp,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Section, SectionHeading } from "@/components/Section";
import { RevealGroup, RevealItem } from "@/components/Reveal";
import { services } from "@/data/site";
import { cn } from "@/lib/utils";
import { easeBrand } from "@/lib/motion";

const icons: Record<string, LucideIcon> = {
  map: Map,
  flag: Flag,
  play: PlayCircle,
  trending: TrendingUp,
  camera: Camera,
  layout: LayoutTemplate,
  zap: Zap,
  ticket: Ticket,
};

export function Services({ headless = false }: { headless?: boolean }) {
  const reduced = useReducedMotion();

  return (
    <Section id="services">
      {headless ? null : (
        <SectionHeading
          eyebrow={services.eyebrow}
          title={services.title}
          highlight={["end", "to", "end."]}
        />
      )}

      <RevealGroup
        gap={0.06}
        className={cn(
          !headless && "mt-16",
          "grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4",
        )}
      >
        {services.items.map((service, index) => {
          const Icon = icons[service.icon] ?? Zap;
          return (
            <RevealItem key={service.title} as="article" className="bg-ink">
              <motion.div
                whileHover={reduced ? undefined : { backgroundColor: "rgba(255,255,255,0.03)" }}
                transition={{ duration: 0.3, ease: easeBrand }}
                className="group relative flex h-full flex-col p-7"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-0.5 w-0 bg-gradient-to-r from-purple to-lime transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full"
                />
                <div className="flex items-center justify-between">
                  <Icon
                    className="h-5 w-5 text-lime transition-transform duration-300 group-hover:scale-110"
                    aria-hidden="true"
                  />
                  <span className="eyebrow text-white/20">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-8 font-display text-base font-semibold leading-snug tracking-tight text-white">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-cool">{service.body}</p>
              </motion.div>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </Section>
  );
}
