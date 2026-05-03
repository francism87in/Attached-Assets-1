import { PageWrapper } from "@/components/PageWrapper";
import { useListProjects, getListProjectsQueryKey, useGetDashboardStats, getGetDashboardStatsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Building2, Globe, Sparkles, BarChart3 } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend,
} from "recharts";
import { Link } from "wouter";

function scoreColor(score?: number | null) {
  if (!score) return "#94a3b8";
  if (score >= 75) return "#22c55e";
  if (score >= 55) return "#eab308";
  return "#ef4444";
}

function scoreLabel(score?: number | null) {
  if (!score) return "N/A";
  if (score >= 80) return "Excellent";
  if (score >= 65) return "Good";
  if (score >= 50) return "Fair";
  return "Poor";
}

export function Analytics() {
  const { data: projects, isLoading: isProjectsLoading } = useListProjects(undefined, {
    query: { queryKey: getListProjectsQueryKey() }
  });
  const { data: stats, isLoading: isStatsLoading } = useGetDashboardStats({
    query: { queryKey: getGetDashboardStatsQueryKey() }
  });

  const scoreBarData = projects?.map(p => ({
    name: p.name.length > 18 ? p.name.slice(0, 18) + "…" : p.name,
    score: p.overallScore ? Math.round(p.overallScore) : 0,
    fill: scoreColor(p.overallScore),
  })) ?? [];

  const apiBarData = projects?.filter(p => p.apiCallCount > 0).map(p => ({
    name: p.name.length > 18 ? p.name.slice(0, 18) + "…" : p.name,
    calls: p.apiCallCount,
  })) ?? [];

  const distribution = [
    { name: "Excellent (80+)", value: projects?.filter(p => (p.overallScore ?? 0) >= 80).length ?? 0, fill: "#22c55e" },
    { name: "Good (65–79)", value: projects?.filter(p => (p.overallScore ?? 0) >= 65 && (p.overallScore ?? 0) < 80).length ?? 0, fill: "#84cc16" },
    { name: "Fair (50–64)", value: projects?.filter(p => (p.overallScore ?? 0) >= 50 && (p.overallScore ?? 0) < 65).length ?? 0, fill: "#eab308" },
    { name: "Poor (<50)", value: projects?.filter(p => (p.overallScore ?? 0) < 50 && (p.overallScore ?? 0) > 0).length ?? 0, fill: "#ef4444" },
  ].filter(d => d.value > 0);

  const avgValue = projects?.reduce((s, p) => s + (p.valueScore ?? 0), 0) ?? 0;
  const avgLocation = projects?.reduce((s, p) => s + (p.locationScore ?? 0), 0) ?? 0;
  const avgTrust = projects?.reduce((s, p) => s + (p.trustScore ?? 0), 0) ?? 0;
  const count = projects?.length || 1;

  const tooltipStyle = {
    background: "hsl(var(--popover))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "8px",
    fontSize: "12px",
    color: "hsl(var(--popover-foreground))",
  };

  return (
    <PageWrapper>
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Portfolio performance and AI score insights.</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Projects", value: isStatsLoading ? null : stats?.totalProjects, icon: Building2, suffix: "" },
          { label: "Avg AI Score", value: isStatsLoading ? null : stats?.avgOverallScore, icon: BarChart3, suffix: "/100" },
          { label: "Total API Calls", value: isStatsLoading ? null : stats?.totalApiCalls, icon: Globe, suffix: "" },
          { label: "AI Summaries", value: isStatsLoading ? null : stats?.projectsWithSummary, icon: Sparkles, suffix: "" },
        ].map(({ label, value, icon: Icon, suffix }) => (
          <Card key={label} className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{label}</div>
                <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
                  <Icon className="w-3.5 h-3.5 text-primary" />
                </div>
              </div>
              {value === null || value === undefined ? (
                <Skeleton className="h-7 w-20" />
              ) : (
                <div className="text-2xl font-bold tracking-tight">{value}{suffix}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Score Averages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Avg Value Score", score: Math.round(avgValue / count) },
          { label: "Avg Location Score", score: Math.round(avgLocation / count) },
          { label: "Avg Trust Score", score: Math.round(avgTrust / count) },
        ].map(({ label, score }) => (
          <Card key={label} className="border-border">
            <CardContent className="p-4">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-3">{label}</div>
              {isProjectsLoading ? <Skeleton className="h-6 w-24" /> : (
                <div className="flex items-end gap-2">
                  <div className={`text-2xl font-bold font-mono ${score >= 75 ? "text-green-600" : score >= 55 ? "text-yellow-600" : "text-red-500"}`}>
                    {projects?.length ? score : "—"}
                  </div>
                  {projects?.length ? (
                    <Badge variant="outline" className={`text-[9px] mb-0.5 ${score >= 75 ? "border-green-500/30 text-green-600" : score >= 55 ? "border-yellow-500/30 text-yellow-600" : "border-red-500/30 text-red-500"}`}>
                      {scoreLabel(score)}
                    </Badge>
                  ) : null}
                </div>
              )}
              {!isProjectsLoading && projects?.length ? (
                <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-2">
                  <div className={`h-full rounded-full ${score >= 75 ? "bg-green-500" : score >= 55 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${score}%` }} />
                </div>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Score Bar Chart */}
        <Card className="border-border lg:col-span-2">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-[11px] uppercase tracking-wider text-muted-foreground font-sans">AI Score by Project</CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-4">
            {isProjectsLoading ? <Skeleton className="h-56 w-full" /> : projects?.length === 0 ? (
              <div className="h-56 flex items-center justify-center text-sm text-muted-foreground">No projects yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={scoreBarData} margin={{ top: 4, right: 16, left: -16, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} angle={-30} textAnchor="end" interval={0} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <RechartsTooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}/100`, "Score"]} />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                    {scoreBarData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Score Distribution Pie */}
        <Card className="border-border">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-[11px] uppercase tracking-wider text-muted-foreground font-sans">Score Distribution</CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-4">
            {isProjectsLoading ? <Skeleton className="h-56 w-full" /> : distribution.length === 0 ? (
              <div className="h-56 flex items-center justify-center text-sm text-muted-foreground">No scored projects.</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={distribution} dataKey="value" nameKey="name" cx="50%" cy="45%" outerRadius={72} innerRadius={40}>
                    {distribution.map((d, i) => <Cell key={i} fill={d.fill} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={tooltipStyle} />
                  <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: "10px" }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* API Calls Bar Chart */}
      {apiBarData.length > 0 && (
        <Card className="border-border">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-[11px] uppercase tracking-wider text-muted-foreground font-sans">API Calls by Project</CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-4">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={apiBarData} margin={{ top: 4, right: 16, left: -16, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} angle={-30} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <RechartsTooltip contentStyle={tooltipStyle} formatter={(v: number) => [v, "API Calls"]} />
                <Bar dataKey="calls" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} fillOpacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Project Score Table */}
      <Card className="border-border overflow-hidden">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-[11px] uppercase tracking-wider text-muted-foreground font-sans">Project Breakdown</CardTitle>
        </CardHeader>
        <div className="divide-y divide-border">
          <div className="grid grid-cols-12 text-[10px] uppercase tracking-wider text-muted-foreground px-4 py-2 bg-muted/40">
            <span className="col-span-4">Project</span>
            <span className="col-span-2 text-center">Overall</span>
            <span className="col-span-2 text-center">Value</span>
            <span className="col-span-2 text-center">Location</span>
            <span className="col-span-2 text-center">Trust</span>
          </div>
          {isProjectsLoading ? Array(3).fill(0).map((_, i) => (
            <div key={i} className="px-4 py-3"><Skeleton className="h-4 w-full" /></div>
          )) : projects?.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No projects yet. <Link href="/projects/new" className="text-primary hover:underline">Create one</Link>
            </div>
          ) : (
            projects?.map(p => {
              const scoreCell = (score?: number | null) => (
                <div className={`font-mono font-bold text-sm ${score && score >= 75 ? "text-green-600" : score && score >= 55 ? "text-yellow-600" : "text-red-500"}`}>
                  {score ? Math.round(score) : "—"}
                </div>
              );
              return (
                <div key={p.id} className="grid grid-cols-12 items-center px-4 py-3 hover:bg-muted/30 transition-colors">
                  <div className="col-span-4">
                    <Link href={`/projects/${p.id}`} className="font-medium text-[13px] hover:text-primary transition-colors truncate block pr-2">
                      {p.name}
                    </Link>
                    <div className="text-[11px] text-muted-foreground">{p.city ?? p.location}</div>
                  </div>
                  <div className="col-span-2 text-center">{scoreCell(p.overallScore)}</div>
                  <div className="col-span-2 text-center">{scoreCell(p.valueScore)}</div>
                  <div className="col-span-2 text-center">{scoreCell(p.locationScore)}</div>
                  <div className="col-span-2 text-center">{scoreCell(p.trustScore)}</div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
    </PageWrapper>
  );
}
