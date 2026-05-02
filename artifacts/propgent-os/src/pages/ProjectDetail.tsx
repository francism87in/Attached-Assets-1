import { useState } from "react";
import { useParams, Link } from "wouter";
import {
  useGetProject,
  useGetProjectScorecard,
  useGenerateProjectSummary,
  useRecalculateScores,
  getGetProjectQueryKey,
  getGetProjectScorecardQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft, Edit, Globe, Sparkles, RefreshCw,
  MapPin, Building2, Calendar, IndianRupee, Maximize2
} from "lucide-react";

export function ProjectDetail() {
  const params = useParams();
  const projectId = parseInt(params.id!);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: project, isLoading } = useGetProject(projectId, {
    query: { enabled: !!projectId, queryKey: getGetProjectQueryKey(projectId) },
  });

  const { data: scorecard, isLoading: isScorecardLoading } = useGetProjectScorecard(projectId, {
    query: { enabled: !!projectId, queryKey: getGetProjectScorecardQueryKey(projectId) },
  });

  const generateSummary = useGenerateProjectSummary({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetProjectQueryKey(projectId) });
        toast({ title: "AI summary generated" });
      },
      onError: () => toast({ title: "Failed to generate summary", variant: "destructive" }),
    },
  });

  const recalculate = useRecalculateScores({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetProjectScorecardQueryKey(projectId) });
        queryClient.invalidateQueries({ queryKey: getGetProjectQueryKey(projectId) });
        toast({ title: "Scores recalculated" });
      },
      onError: () => toast({ title: "Failed to recalculate", variant: "destructive" }),
    },
  });

  function formatPrice(val?: number | null) {
    if (!val) return "—";
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
    return `₹${val.toLocaleString("en-IN")}`;
  }

  function scoreColor(score?: number | null) {
    if (!score) return "bg-muted";
    if (score >= 75) return "bg-green-500";
    if (score >= 55) return "bg-yellow-500";
    return "bg-red-500";
  }

  function scoreTextColor(score?: number | null) {
    if (!score) return "text-muted-foreground";
    if (score >= 75) return "text-green-600";
    if (score >= 55) return "text-yellow-600";
    return "text-red-500";
  }

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Project not found.</p>
        <Link href="/projects"><Button variant="outline" className="mt-4">Back to Projects</Button></Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3">
          <Link href="/projects">
            <Button variant="ghost" size="icon" className="w-8 h-8 mt-1" data-testid="button-back">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-serif tracking-tight" data-testid="text-project-name">{project.name}</h1>
              <Badge
                variant={project.status === "active" ? "default" : project.status === "draft" ? "secondary" : "outline"}
                data-testid="status-project"
              >
                {project.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{project.developerName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/projects/${projectId}/api`}>
            <Button variant="outline" size="sm" className="gap-2" data-testid="button-api-explorer">
              <Globe className="w-4 h-4" /> API
            </Button>
          </Link>
          <Link href={`/projects/${projectId}/edit`}>
            <Button variant="outline" size="sm" className="gap-2" data-testid="button-edit">
              <Edit className="w-4 h-4" /> Edit
            </Button>
          </Link>
        </div>
      </div>

      {/* Project Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase tracking-wider">Location</span>
            </div>
            <div className="font-medium text-sm leading-tight" data-testid="text-location">
              {project.location}{project.city ? `, ${project.city}` : ""}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <IndianRupee className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase tracking-wider">Price Range</span>
            </div>
            <div className="font-mono font-medium text-sm" data-testid="text-price-range">
              {formatPrice(project.priceMin)} – {formatPrice(project.priceMax)}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase tracking-wider">Carpet Area</span>
            </div>
            <div className="font-mono font-medium text-sm" data-testid="text-carpet-area">
              {project.carpetAreaMin ?? "—"} – {project.carpetAreaMax ?? "—"} sq ft
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase tracking-wider">Possession</span>
            </div>
            <div className="font-medium text-sm" data-testid="text-possession">{project.possessionDate ?? "—"}</div>
          </CardContent>
        </Card>
      </div>

      {/* Unit Types & Amenities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-sans">Unit Types</CardTitle>
          </CardHeader>
          <CardContent>
            {(project.unitTypes as any[])?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {(project.unitTypes as any[]).map((u: any) => (
                  <Badge key={u.type} variant="secondary" data-testid={`badge-unit-${u.type}`}>{u.type}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No unit types specified</p>
            )}
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-sans">Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            {(project.amenities as string[])?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {(project.amenities as string[]).map((a: string) => (
                  <Badge key={a} variant="outline" className="text-xs" data-testid={`badge-amenity-${a.replace(/\s/g, "-")}`}>{a}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No amenities listed</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Scorecard */}
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-sans">AI Scorecard</CardTitle>
          <Button
            variant="ghost" size="sm"
            className="gap-2 h-7 text-xs"
            onClick={() => recalculate.mutate({ id: projectId })}
            disabled={recalculate.isPending}
            data-testid="button-recalculate"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${recalculate.isPending ? "animate-spin" : ""}`} />
            Recalculate
          </Button>
        </CardHeader>
        <CardContent>
          {isScorecardLoading ? (
            <div className="space-y-4">
              {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-12" />)}
            </div>
          ) : scorecard ? (
            <div className="space-y-5">
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="text-center">
                  <div className={`text-3xl font-bold font-mono ${scoreTextColor(scorecard.overallScore)}`} data-testid="text-overall-score">
                    {scorecard.overallScore.toFixed(1)}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Overall</div>
                </div>
                <div className="flex-1 space-y-3">
                  {[
                    { label: "Value Score", value: scorecard.valueScore, explanation: scorecard.breakdown.valueExplanation },
                    { label: "Location Score", value: scorecard.locationScore, explanation: scorecard.breakdown.locationExplanation },
                    { label: "Trust Score", value: scorecard.trustScore, explanation: scorecard.breakdown.trustExplanation },
                  ].map(({ label, value, explanation }) => (
                    <div key={label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">{label}</span>
                        <span className={`font-mono text-xs font-medium ${scoreTextColor(value)}`}>{value}/100</span>
                      </div>
                      <Progress value={value} className="h-1.5" />
                      <p className="text-[11px] text-muted-foreground mt-1">{explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Scorecard not available.</p>
          )}
        </CardContent>
      </Card>

      {/* AI Summary */}
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-sans">AI Summary</CardTitle>
          <Button
            size="sm"
            className="gap-2 h-7 text-xs"
            onClick={() => generateSummary.mutate({ id: projectId })}
            disabled={generateSummary.isPending}
            data-testid="button-generate-summary"
          >
            <Sparkles className={`w-3.5 h-3.5 ${generateSummary.isPending ? "animate-pulse" : ""}`} />
            {generateSummary.isPending ? "Generating..." : project.hasSummary ? "Regenerate" : "Generate Summary"}
          </Button>
        </CardHeader>
        <CardContent>
          {project.hasSummary && project.aiSummary ? (
            <div className="space-y-4">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Summary</div>
                <p className="text-sm leading-relaxed" data-testid="text-ai-summary">{project.aiSummary}</p>
              </div>
              {project.investmentAngle && (
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Investment Angle</div>
                  <p className="text-sm leading-relaxed" data-testid="text-investment-angle">{project.investmentAngle}</p>
                </div>
              )}
              {project.idealBuyerPersona && (
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Ideal Buyer</div>
                  <p className="text-sm leading-relaxed" data-testid="text-ideal-buyer">{project.idealBuyerPersona}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="py-6 text-center">
              <Sparkles className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No AI summary yet.</p>
              <p className="text-xs text-muted-foreground mt-1">Generate one to make this project AI-discoverable.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Access */}
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-sans">API Access</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm font-mono text-primary" data-testid="text-api-url">/api/public/projects/{projectId}</p>
            <p className="text-xs text-muted-foreground mt-1">{project.apiCallCount} API calls recorded</p>
          </div>
          <Link href={`/projects/${projectId}/api`}>
            <Button variant="outline" className="gap-2" data-testid="button-view-api">
              <Globe className="w-4 h-4" />
              Open API Explorer
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
