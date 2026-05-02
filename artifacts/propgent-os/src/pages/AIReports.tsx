import { Link } from "wouter";
import { useListProjects, getListProjectsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileBarChart2, Sparkles, Download, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

export function AIReports() {
  const { data: projects, isLoading } = useListProjects(undefined, {
    query: { queryKey: getListProjectsQueryKey() }
  });

  const aiReadyProjects = projects?.filter((p) => p.hasSummary) ?? [];
  const pendingProjects = projects?.filter((p) => !p.hasSummary) ?? [];

  function scoreColor(score?: number | null) {
    if (!score) return "text-muted-foreground";
    if (score >= 75) return "text-green-600";
    if (score >= 55) return "text-yellow-600";
    return "text-red-500";
  }

  function scoreLabel(score?: number | null) {
    if (!score) return "N/A";
    if (score >= 80) return "Excellent";
    if (score >= 65) return "Good";
    if (score >= 50) return "Fair";
    return "Poor";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight">AI Reports</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            AI readiness status and generated summaries for all projects.
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-4.5 h-4.5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{isLoading ? "—" : aiReadyProjects.length}</div>
                <div className="text-xs text-muted-foreground">AI Ready</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <AlertCircle className="w-4.5 h-4.5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{isLoading ? "—" : pendingProjects.length}</div>
                <div className="text-xs text-muted-foreground">Pending Summary</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileBarChart2 className="w-4.5 h-4.5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{isLoading ? "—" : projects?.length ?? 0}</div>
                <div className="text-xs text-muted-foreground">Total Projects</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Ready Projects */}
      <div>
        <h2 className="text-[15px] font-semibold mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600" /> AI-Ready Projects
        </h2>
        <Card className="border-border overflow-hidden">
          <div className="divide-y divide-border">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="p-4 flex items-center gap-3">
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))
            ) : aiReadyProjects.length === 0 ? (
              <div className="p-10 text-center">
                <Sparkles className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No projects have AI summaries yet.</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Open a project and click "Generate Summary".</p>
              </div>
            ) : (
              aiReadyProjects.map(project => (
                <div key={project.id} className="flex items-center justify-between gap-4 px-4 py-3.5 hover:bg-muted/30 transition-colors">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[13px] truncate">{project.name}</span>
                      <Badge variant="outline" className="text-[9px] border-green-500/30 text-green-600 shrink-0">AI Ready</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {project.developerName} · {project.city ?? project.location}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right hidden sm:block">
                      <div className={`font-mono font-bold text-sm ${scoreColor(project.overallScore)}`}>
                        {project.overallScore?.toFixed(1) ?? "—"}/100
                      </div>
                      <div className={`text-[10px] uppercase font-medium ${scoreColor(project.overallScore)}`}>
                        {scoreLabel(project.overallScore)}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5" disabled>
                        <Download className="w-3.5 h-3.5" /> PDF
                      </Button>
                      <Link href={`/projects/${project.id}`}>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Pending Projects */}
      {!isLoading && pendingProjects.length > 0 && (
        <div>
          <h2 className="text-[15px] font-semibold mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600" /> Pending AI Summary
          </h2>
          <Card className="border-border overflow-hidden">
            <div className="divide-y divide-border">
              {pendingProjects.map(project => (
                <div key={project.id} className="flex items-center justify-between gap-4 px-4 py-3.5 hover:bg-muted/30 transition-colors">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-[13px] truncate">{project.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{project.developerName} · {project.city ?? project.location}</div>
                  </div>
                  <Link href={`/projects/${project.id}`}>
                    <Button size="sm" className="h-7 text-xs gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Generate Summary
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* PDF Note */}
      <Card className="border-border bg-muted/20">
        <CardContent className="p-4 flex items-start gap-3">
          <FileBarChart2 className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-medium">PDF Export — Coming Soon</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Download branded AI Readiness Reports as PDF for sharing with investors and buyers. This feature is in development.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
