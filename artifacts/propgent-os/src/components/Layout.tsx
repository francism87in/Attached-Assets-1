import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, Building2, PlusCircle, FileBarChart2,
  Terminal, BarChart3, Users, Settings, Menu, X, Activity,
  ChevronRight, LogOut
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface LayoutProps {
  children: React.ReactNode;
}

const mainNav = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: Building2 },
  { name: "AI Reports", href: "/ai-reports", icon: FileBarChart2 },
  { name: "API Console", href: "/api-console", icon: Terminal },
];

const secondaryNav = [
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Team", href: "/team", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { toast } = useToast();

  function isActive(href: string) {
    if (href === "/dashboard") return location === "/dashboard" || location === "/";
    return location.startsWith(href);
  }

  async function handleLogout() {
    await logout();
    toast({ title: "Signed out" });
  }

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row font-sans text-sm">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-sidebar">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-primary flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white tracking-tight text-base">PropAgent OS</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-1.5 text-sidebar-foreground/60 hover:text-sidebar-foreground">
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="px-5 py-5 hidden md:flex items-center gap-3 border-b border-sidebar-border">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Activity className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <div className="font-bold text-sidebar-foreground text-[15px] tracking-tight leading-none">PropAgent OS</div>
            <div className="text-[10px] text-sidebar-foreground/40 mt-0.5 uppercase tracking-widest">AI Real Estate Intelligence</div>
          </div>
        </div>

        {/* Main Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <div className="text-[9px] text-sidebar-foreground/30 uppercase tracking-widest px-3 pb-2 font-medium">Main</div>
          {mainNav.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-100 text-[13px] font-medium group",
                isActive(item.href)
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <item.icon className="w-[15px] h-[15px] shrink-0" />
              {item.name}
              {isActive(item.href) && (
                <ChevronRight className="w-3 h-3 ml-auto opacity-60" />
              )}
            </Link>
          ))}

          <div className="text-[9px] text-sidebar-foreground/30 uppercase tracking-widest px-3 pb-2 pt-5 font-medium">Workspace</div>
          {secondaryNav.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-100 text-[13px]",
                isActive(item.href)
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/40 hover:text-sidebar-foreground/70 hover:bg-sidebar-accent"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <item.icon className="w-[15px] h-[15px] shrink-0" />
              {item.name}
            </Link>
          ))}

          {/* New Project CTA */}
          <div className="pt-4">
            <Link
              href="/projects/new"
              className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-[13px] font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <PlusCircle className="w-[15px] h-[15px]" />
              New Project
            </Link>
          </div>
        </nav>

        {/* User Profile */}
        <div className="px-3 py-3 border-t border-sidebar-border space-y-1">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-sidebar-accent transition-colors cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[11px] font-bold shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[12px] font-medium text-sidebar-foreground leading-none truncate">{user?.name ?? "User"}</div>
              <div className="text-[10px] text-sidebar-foreground/40 mt-0.5 capitalize">{user?.role ?? "developer"}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sidebar-foreground/40 hover:text-red-400 hover:bg-red-500/10 transition-colors text-[12px]"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
