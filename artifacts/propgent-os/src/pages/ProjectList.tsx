import { useState } from "react";
import { Link } from "wouter";
import { PageWrapper } from "@/components/PageWrapper";
import {
  useListProjects,
  getListProjectsQueryKey,
  useDeleteProject,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Building2, Plus, Search, MoreHorizontal, Edit, Trash2, Eye,
  Globe, Download, Filter, BarChart2, X,
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

type StatusFilter = "all" | "active" | "draft" | "inactive";

function exportCsv(projects: any[]) {
  const headers = [
    "ID", "Name", "Developer", "Location", "City", "Status",
    "Overall Score", "Value Score", "Location Score", "Trust Score",
    "Price Min (Cr)", "Price Max (Cr)", "Carpet Min (sqft)", "Carpet Max (sqft)",
    "Possession", "API Calls", "Has AI Summary", "Created At",
  ];
  const rows = projects.map(p => [
    p.id,
    `"${(p.name ?? "").replace(/"/g, '""')}"`,
    `"${(p.developerName ?? "").replace(/"/g, '""')}"`,
    `"${(p.location ?? "").replace(/"/g, '""')}"`,
    `"${(p.city ?? "").replace(/"/g, '""')}"`,
    p.status ?? "",
    p.overallScore ? p.overallScore.toFixed(1) : "",
    p.valueScore ? p.valueScore.toFixed(1) : "",
    p.locationScore ? p.locationScore.toFixed(1) : "",
    p.trustScore ? p.trustScore.toFixed(1) : "",
    p.priceMin ?? "",
    p.priceMax ?? "",
    p.carpetAreaMin ?? "",
    p.carpetAreaMax ?? "",
    `"${p.possessionDate ?? ""}"`,
    p.apiCallCount ?? 0,
    p.hasSummary ? "Yes" : "No",
    p.createdAt ? format(new Date(p.createdAt), "yyyy-MM-dd") : "",
  ]);
  const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `propgent-projects-${format(new Date(), "yyyy-MM-dd")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function ProjectList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: projects, isLoading } = useListProjects(
    search ? { search } : undefined,
    { query: { queryKey: getListProjectsQueryKey(search ? { search } : undefined) } }
  );

  const deleteProject = useDeleteProject({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
        toast({ title: "Project deleted" });
        setDeleteId(null);
      },
    },
  });

  const filtered = projects?.filter(p =>
    statusFilter === "all" ? true : p.status === statusFilter
  ) ?? [];

  function scoreColor(score?: number | null) {
    if (!score) return "text-muted-foreground";
    if (score >= 75) return "text-green-600";
    if (score >= 55) return "text-yellow-600";
    return "text-red-500";
  }

  const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "draft", label: "Draft" },
    { value: "inactive", label: "Inactive" },
  ];

  return (
    <PageWrapper>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-serif tracking-tight">Projects</h1>
          <p className="text-muted-foreground text-sm">All real estate listings in your portfolio.</p>
        </div>
        <div className="flex items-center gap-2">
          {projects && projects.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2 h-9 text-[13px]"
              onClick={() => {
                exportCsv(projects);
                toast({ title: "Exported to CSV" });
              }}
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </Button>
          )}
          {projects && projects.length >= 2 && (
            <Link href="/compare">
              <Button variant="outline" size="sm" className="gap-2 h-9 text-[13px]">
                <BarChart2 className="w-3.5 h-3.5" />
                Compare
              </Button>
            </Link>
          )}
          <Link href="/projects/new">
            <Button data-testid="button-new-project" className="gap-2 h-9 text-[13px]">
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Search + Filter Row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            data-testid="input-search"
            placeholder="Search projects, developers, locations..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1 bg-muted/50 rounded-md border border-border px-1">
          <Filter className="w-3.5 h-3.5 text-muted-foreground ml-1.5" />
          {STATUS_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`px-2.5 py-1 rounded-sm text-[12px] font-medium transition-colors ${
                statusFilter === opt.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active filter indicator */}
      {statusFilter !== "all" && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1.5 text-[11px]">
            Status: {statusFilter}
            <button onClick={() => setStatusFilter("all")} className="hover:opacity-70">
              <X className="w-3 h-3" />
            </button>
          </Badge>
          {!isLoading && (
            <span className="text-[12px] text-muted-foreground">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
          )}
        </div>
      )}

      <Card className="border-border overflow-hidden">
        <div className="divide-y divide-border">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="p-4 flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[220px]" />
                  <Skeleton className="h-3 w-[160px]" />
                </div>
                <Skeleton className="h-8 w-[80px]" />
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center">
              <Building2 className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">No projects found</p>
              <p className="text-sm text-muted-foreground mt-1">
                {search
                  ? "Try a different search term."
                  : statusFilter !== "all"
                  ? `No ${statusFilter} projects.`
                  : "Create your first project to get started."}
              </p>
              {!search && statusFilter === "all" && (
                <Link href="/projects/new">
                  <Button className="mt-4 gap-2" variant="outline" data-testid="button-create-first">
                    <Plus className="w-4 h-4" /> Create Project
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            filtered.map((project) => (
              <div key={project.id} data-testid={`row-project-${project.id}`} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link href={`/projects/${project.id}`} className="font-medium hover:text-primary transition-colors truncate" data-testid={`link-project-${project.id}`}>
                      {project.name}
                    </Link>
                    <Badge
                      variant={project.status === "active" ? "default" : project.status === "draft" ? "secondary" : "outline"}
                      className="text-[10px] uppercase h-5 shrink-0"
                      data-testid={`status-project-${project.id}`}
                    >
                      {project.status}
                    </Badge>
                    {project.hasSummary && (
                      <Badge variant="outline" className="text-[10px] h-5 shrink-0 border-green-500/30 text-green-600">AI Ready</Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                    <span>{project.developerName}</span>
                    <span>•</span>
                    <span>{project.location}{project.city ? `, ${project.city}` : ""}</span>
                    {project.possessionDate && <><span>•</span><span>{project.possessionDate}</span></>}
                  </div>
                </div>

                <div className="flex items-center gap-6 ml-4 shrink-0">
                  <div className="hidden md:block text-right">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Score</div>
                    <div className={`font-mono font-bold text-sm ${scoreColor(project.overallScore)}`} data-testid={`text-score-${project.id}`}>
                      {project.overallScore ? project.overallScore.toFixed(1) : "—"}/100
                    </div>
                  </div>
                  <div className="hidden md:block text-right">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">API Calls</div>
                    <div className="font-mono text-sm" data-testid={`text-api-calls-${project.id}`}>{project.apiCallCount}</div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="w-8 h-8" data-testid={`button-menu-${project.id}`}>
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/projects/${project.id}`} className="flex items-center gap-2 cursor-pointer">
                          <Eye className="w-4 h-4" /> View Detail
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/projects/${project.id}/edit`} className="flex items-center gap-2 cursor-pointer">
                          <Edit className="w-4 h-4" /> Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/projects/${project.id}/api`} className="flex items-center gap-2 cursor-pointer">
                          <Globe className="w-4 h-4" /> API Explorer
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive gap-2"
                        onClick={() => setDeleteId(project.id)}
                        data-testid={`button-delete-${project.id}`}
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The project and all associated data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              data-testid="button-confirm-delete"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteId && deleteProject.mutate({ id: deleteId })}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    </PageWrapper>
  );
}
