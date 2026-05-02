import { Link } from "wouter";
import {
  useGetDashboardStats,
  getGetDashboardStatsQueryKey,
  useListProjects,
  getListProjectsQueryKey,
  useGetRecentActivity,
  getGetRecentActivityQueryKey
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Activity, Globe, FileText, ArrowRight, Plus, TrendingUp, TrendingDown } from "lucide-react";
import { format } from "date-fns";

export function Dashboard() {
  const { data: stats, isLoading: isStatsLoading } = useGetDashboardStats({
    query: { queryKey: getGetDashboardStatsQueryKey() }
  });

  const { data: projects, isLoading: isProjectsLoading } = useListProjects(undefined, {
    query: { queryKey: getListProjectsQueryKey() }
  });

  const { data: activity, isLoading: isActivityLoading } = useGetRecentActivity({
    query: { queryKey: getGetRecentActivityQueryKey() }
  });

  const today = new Date();
  const greeting = today.getHours() < 12 ? "Good morning" : today.getHours() < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-7">
      {/* Welcome Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight">
            {greeting}, Amit 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Here's what's happening with your projects today.
          </p>
        </div>
        <Link href="/projects/new">
          <Button className="gap-2 h-9 text-sm" data-testid="button-new-project">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Projects"
          value={stats?.totalProjects}
          icon={Building2}
          suffix=""
          change="+10% this month"
          up={true}
          isLoading={isStatsLoading}
        />
        <StatCard
          title="Avg AI Score"
          value={stats?.avgOverallScore ? `${stats.avgOverallScore}` : undefined}
          icon={Activity}
          suffix="/100"
          change="+8 points"
          up={true}
          isLoading={isStatsLoading}
        />
        <StatCard
          title="API Calls"
          value={stats?.totalApiCalls}
          icon={Globe}
          suffix=""
          change="+15% this month"
          up={true}
          isLoading={isStatsLoading}
        />
        <StatCard
          title="Reports Generated"
          value={stats?.activeProjects}
          icon={FileText}
          suffix=""
          change="+22% this month"
          up={true}
          isLoading={isStatsLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects Table */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-[15px]">Recent Projects</h2>
            <Link href="/projects" className="text-xs text-primary hover:underline font-medium">View all</Link>
          </div>

          <Card className="border-border overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 text-[10px] uppercase tracking-wider text-muted-foreground px-4 py-2.5 bg-muted/40 border-b border-border">
              <span className="col-span-5">Project Name</span>
              <span className="col-span-3">Location</span>
              <span className="col-span-2 text-center">AI Score</span>
              <span className="col-span-1 text-center">Status</span>
              <span className="col-span-1"></span>
            </div>
            <div className="divide-y divide-border">
              {isProjectsLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="p-4 flex items-center gap-3">
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))
              ) : projects?.length === 0 ? (
                <div className="p-10 text-center text-sm text-muted-foreground">
                  No projects yet. <Link href="/projects/new" className="text-primary hover:underline">Create one</Link>
                </div>
              ) : (
                projects?.slice(0, 6).map(project => (
                  <div key={project.id} className="grid grid-cols-12 items-center px-4 py-3 hover:bg-muted/30 transition-colors">
                    <div className="col-span-5 font-medium text-[13px] truncate pr-2">
                      <Link href={`/projects/${project.id}`} className="hover:text-primary transition-colors" data-testid={`link-project-${project.id}`}>
                        {project.name}
                      </Link>
                    </div>
                    <div className="col-span-3 text-xs text-muted-foreground truncate pr-2">
                      {project.city ?? project.location}
                    </div>
                    <div className="col-span-2 text-center">
                      <ScorePill score={project.overallScore} />
                    </div>
                    <div className="col-span-1 text-center">
                      <Badge
                        variant={project.status === "active" ? "default" : project.status === "draft" ? "secondary" : "outline"}
                        className="text-[9px] uppercase h-4 px-1.5"
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <Link href={`/projects/${project.id}`} className="text-muted-foreground hover:text-primary transition-colors">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Activity Feed */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-[15px]">System Activity</h2>
          </div>
          <Card className="border-border">
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {isActivityLoading ? (
                  Array(6).fill(0).map((_, i) => (
                    <div key={i} className="p-4 space-y-2">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-2 w-24" />
                    </div>
                  ))
                ) : activity?.length === 0 ? (
                  <div className="p-6 text-center text-sm text-muted-foreground">No recent activity.</div>
                ) : (
                  activity?.map(item => (
                    <div key={item.id} className="px-4 py-3">
                      <div className="text-[12px] leading-snug">
                        <span className="font-medium">{item.projectName}</span>
                        <span className="text-muted-foreground"> — {item.action}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground/60 mt-1 font-mono">
                        {format(new Date(item.timestamp), "MMM d, HH:mm")}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, suffix, change, up, isLoading }: {
  title: string; value: any; icon: any; suffix: string;
  change: string; up: boolean; isLoading: boolean;
}) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
        <CardTitle className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{title}</CardTitle>
        <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {isLoading ? (
          <Skeleton className="h-8 w-24 mt-1" />
        ) : (
          <>
            <div className="text-[28px] font-bold tracking-tight leading-none mt-1">
              {value ?? "—"}<span className="text-sm font-normal text-muted-foreground">{suffix}</span>
            </div>
            <div className={`flex items-center gap-1 text-[11px] mt-2 font-medium ${up ? "text-green-600" : "text-red-500"}`}>
              {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {change}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function ScorePill({ score }: { score?: number | null }) {
  if (!score) return <span className="text-muted-foreground text-xs">—</span>;
  const color = score >= 75 ? "bg-green-500/10 text-green-700 border-green-500/20"
    : score >= 55 ? "bg-yellow-500/10 text-yellow-700 border-yellow-500/20"
    : "bg-red-500/10 text-red-600 border-red-500/20";
  return (
    <span className={`inline-flex items-center justify-center font-mono text-[11px] font-bold px-1.5 py-0.5 rounded border ${color}`}>
      {score.toFixed(1)}
    </span>
  );
}
