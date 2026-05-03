import { useState } from "react";
import { Bell } from "lucide-react";
import { useGetRecentActivity, getGetRecentActivityQueryKey } from "@workspace/api-client-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

const ACTION_COLORS: Record<string, string> = {
  created: "bg-blue-500",
  updated: "bg-yellow-500",
  deleted: "bg-red-500",
  summary_generated: "bg-green-500",
  scores_recalculated: "bg-purple-500",
  api_called: "bg-cyan-500",
};

function actionLabel(action: string) {
  return action.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);

  const { data: activity, isLoading } = useGetRecentActivity({
    query: { queryKey: getGetRecentActivityQueryKey(), refetchInterval: open ? 30_000 : false }
  });

  const recent = activity?.slice(0, 8) ?? [];
  const hasNew = recent.some(a => {
    const age = Date.now() - new Date(a.timestamp).getTime();
    return age < 60 * 60 * 1000;
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <Bell className="w-4 h-4" />
          {hasNew && (
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0" sideOffset={8}>
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
          <div className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground">Recent Activity</div>
          {hasNew && <span className="text-[10px] text-primary font-medium">New</span>}
        </div>
        <div className="max-h-[320px] overflow-y-auto">
          {isLoading ? (
            <div className="p-3 space-y-3">
              {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : recent.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">No activity yet.</div>
          ) : (
            recent.map(a => (
              <Link
                key={a.id}
                href={`/projects/${a.projectId}`}
                onClick={() => setOpen(false)}
                className="flex items-start gap-2.5 px-3 py-2.5 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0 block"
              >
                <span className={cn("w-1.5 h-1.5 rounded-full shrink-0 mt-1.5", ACTION_COLORS[a.action] ?? "bg-muted-foreground")} />
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-medium leading-tight truncate">{a.projectName}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{actionLabel(a.action)}</div>
                </div>
                <div className="text-[10px] text-muted-foreground shrink-0 mt-0.5">
                  {formatDistanceToNow(new Date(a.timestamp), { addSuffix: true })}
                </div>
              </Link>
            ))
          )}
        </div>
        {recent.length > 0 && (
          <div className="px-3 py-2 border-t border-border">
            <Link href="/dashboard" onClick={() => setOpen(false)} className="text-[11px] text-primary hover:underline">
              View full activity log →
            </Link>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
