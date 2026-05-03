import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput,
  CommandItem, CommandList, CommandSeparator, CommandShortcut,
} from "@/components/ui/command";
import { useListProjects, getListProjectsQueryKey } from "@workspace/api-client-react";
import {
  LayoutDashboard, Building2, FileBarChart2, Terminal,
  BarChart3, Users, Settings, PlusCircle, BarChart2, ArrowRight,
} from "lucide-react";

const PAGES = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, shortcut: "D" },
  { name: "Projects", href: "/projects", icon: Building2, shortcut: "P" },
  { name: "New Project", href: "/projects/new", icon: PlusCircle },
  { name: "AI Reports", href: "/ai-reports", icon: FileBarChart2 },
  { name: "API Console", href: "/api-console", icon: Terminal },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Compare Projects", href: "/compare", icon: BarChart2 },
  { name: "Team", href: "/team", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: Props) {
  const [, navigate] = useLocation();
  const [query, setQuery] = useState("");

  const { data: projects } = useListProjects(
    query ? { search: query } : undefined,
    { query: { queryKey: getListProjectsQueryKey(query ? { search: query } : undefined), enabled: open } }
  );

  function go(href: string) {
    navigate(href);
    onOpenChange(false);
    setQuery("");
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search pages, projects..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Pages">
          {PAGES.map(page => {
            const Icon = page.icon;
            return (
              <CommandItem key={page.href} onSelect={() => go(page.href)} className="gap-3">
                <Icon className="w-4 h-4 text-muted-foreground" />
                {page.name}
                {page.shortcut && <CommandShortcut>⌘{page.shortcut}</CommandShortcut>}
              </CommandItem>
            );
          })}
        </CommandGroup>

        {projects && projects.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Projects">
              {projects.slice(0, 8).map(p => (
                <CommandItem key={p.id} onSelect={() => go(`/projects/${p.id}`)} className="gap-3">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate">{p.name}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{p.location}{p.city ? `, ${p.city}` : ""}</div>
                  </div>
                  {p.overallScore ? (
                    <span className={`text-xs font-mono font-bold ${p.overallScore >= 75 ? "text-green-600" : p.overallScore >= 55 ? "text-yellow-600" : "text-red-500"}`}>
                      {Math.round(p.overallScore)}
                    </span>
                  ) : null}
                  <ArrowRight className="w-3 h-3 text-muted-foreground" />
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}

export function useCommandPaletteShortcut(onOpen: () => void) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpen();
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onOpen]);
}
