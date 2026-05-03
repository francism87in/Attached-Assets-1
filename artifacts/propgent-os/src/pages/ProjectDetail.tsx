import { useState } from "react";
import { useParams, Link } from "wouter";
import { PageWrapper } from "@/components/PageWrapper";
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
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft, Edit, Globe, Sparkles, RefreshCw,
  MapPin, Calendar, IndianRupee, Maximize2, Share2, ChevronRight
} from "lucide-react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";

type Tab = "overview" | "scores" | "ai-summary" | "api";

export function ProjectDetail() {
  const params = useParams();
  const projectId = parseInt(params.id!);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("overview");

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

  // Derived scores from existing data
  const amenityCount = (project?.amenities as string[])?.length ?? 0;
  const lifestyleScore = Math.min(100, Math.round(amenityCount * 7.5 + 10));
  const investmentScore = scorecard
    ? Math.round(scorecard.valueScore * 0.35 + scorecard.locationScore * 0.45 + scorecard.trustScore * 0.2)
    : 50;

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "scores", label: "Scores" },
    { id: "ai-summary", label: "AI Summary" },
    { id: "api", label: "API & Integrations" },
  ];

  if (isLoading) {
    return (
      <div className="space-y-5 max-w-5xl">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-4 gap-3">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
        <Skeleton className="h-64 w-full" />
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
    <PageWrapper>
    <div className="space-y-5 max-w-5xl">
      {/* Breadcrumb + Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
          <Link href="/projects" className="hover:text-foreground transition-colors">Projects</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">{project.name}</span>
        </div>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-3">
            <Link href="/projects">
              <Button variant="outline" size="icon" className="w-8 h-8 mt-0.5 shrink-0" data-testid="button-back">
                <ArrowLeft className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-bold tracking-tight" data-testid="text-project-name">{project.name}</h1>
                <Badge
                  variant={project.status === "active" ? "default" : project.status === "draft" ? "secondary" : "outline"}
                  className="text-[10px] uppercase"
                  data-testid="status-project"
                >
                  {project.status === "active" ? "Published" : project.status}
                </Badge>
                {project.hasSummary && (
                  <Badge variant="outline" className="text-[10px] border-green-500/30 text-green-600">AI Ready</Badge>
                )}
              </div>
              <div className="text-sm text-muted-foreground mt-0.5">
                {project.developerName}
                {project.city && <span> · {project.city}</span>}
                {(project.unitTypes as any[])?.slice(0, 3).map((u: any) => (
                  <span key={u.type} className="ml-1">· {u.type}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs" data-testid="button-share">
              <Share2 className="w-3.5 h-3.5" /> Share Report
            </Button>
            <Link href={`/projects/${projectId}/edit`}>
              <Button size="sm" className="gap-1.5 h-8 text-xs" data-testid="button-edit">
                <Edit className="w-3.5 h-3.5" /> Edit Project
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: MapPin, label: "Location", value: `${project.location}${project.city ? `, ${project.city}` : ""}` },
          { icon: IndianRupee, label: "Price Range", value: `${formatPrice(project.priceMin)} – ${formatPrice(project.priceMax)}`, mono: true },
          { icon: Maximize2, label: "Carpet Area", value: `${project.carpetAreaMin ?? "—"}–${project.carpetAreaMax ?? "—"} sq ft`, mono: true },
          { icon: Calendar, label: "Possession", value: project.possessionDate ?? "—" },
        ].map(({ icon: Icon, label, value, mono }) => (
          <Card key={label} className="border-border">
            <CardContent className="p-3.5">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1.5">
                <Icon className="w-3.5 h-3.5" />
                <span className="text-[9px] uppercase tracking-wider font-medium">{label}</span>
              </div>
              <div className={`text-sm font-medium leading-tight ${mono ? "font-mono" : ""}`}>{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-0">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-[13px] font-medium border-b-2 transition-colors ${
                tab === t.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {tab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card className="border-border">
            <CardHeader className="pb-3 pt-4 px-4">
              <CardTitle className="text-[11px] uppercase tracking-wider text-muted-foreground font-sans">Unit Types</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {(project.unitTypes as any[])?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {(project.unitTypes as any[]).map((u: any) => (
                    <div key={u.type} className="px-3 py-1.5 rounded-md border border-border bg-muted/50 text-sm font-medium">{u.type}</div>
                  ))}
                </div>
              ) : <p className="text-sm text-muted-foreground">No unit types specified</p>}
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3 pt-4 px-4">
              <CardTitle className="text-[11px] uppercase tracking-wider text-muted-foreground font-sans">Amenities</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {(project.amenities as string[])?.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {(project.amenities as string[]).map((a: string) => (
                    <Badge key={a} variant="outline" className="text-xs font-normal">{a}</Badge>
                  ))}
                </div>
              ) : <p className="text-sm text-muted-foreground">No amenities listed</p>}
            </CardContent>
          </Card>

          <Card className="border-border md:col-span-2">
            <CardHeader className="pb-3 pt-4 px-4 flex flex-row items-center justify-between">
              <CardTitle className="text-[11px] uppercase tracking-wider text-muted-foreground font-sans">AI Scorecard Summary</CardTitle>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5" onClick={() => setTab("scores")}>
                View Full Scorecard
              </Button>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="flex items-center gap-6 flex-wrap">
                {isScorecardLoading ? <Skeleton className="h-16 w-full" /> : (
                  <>
                    <div className="text-center">
                      <div className={`text-4xl font-bold font-mono ${scoreRingColor(scorecard?.overallScore)}`}>{scorecard?.overallScore.toFixed(1) ?? "—"}</div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Overall</div>
                    </div>
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { label: "Value", score: scorecard?.valueScore },
                        { label: "Location", score: scorecard?.locationScore },
                        { label: "Lifestyle", score: lifestyleScore },
                        { label: "Trust", score: scorecard?.trustScore },
                      ].map(({ label, score }) => (
                        <div key={label} className="text-center p-2 rounded-lg bg-muted/50">
                          <div className={`text-lg font-bold font-mono ${scoreRingColor(score)}`}>{score ?? "—"}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">{label}</div>
                          <div className={`text-[9px] uppercase tracking-wider font-medium mt-0.5 ${scoreRingColor(score)}`}>
                            {scoreLabel(score)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {tab === "scores" && (
        <Card className="border-border">
          <CardHeader className="pb-3 pt-4 px-4 flex flex-row items-center justify-between">
            <CardTitle className="text-[11px] uppercase tracking-wider text-muted-foreground font-sans">AI Scorecard</CardTitle>
            <Button
              variant="outline" size="sm" className="gap-1.5 h-7 text-xs"
              onClick={() => recalculate.mutate({ id: projectId })}
              disabled={recalculate.isPending}
              data-testid="button-recalculate"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${recalculate.isPending ? "animate-spin" : ""}`} />
              Recalculate
            </Button>
          </CardHeader>
          <CardContent className="px-4 pb-6">
            {isScorecardLoading ? (
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-28" />)}
              </div>
            ) : scorecard ? (
              <>
                {/* Score Rings */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-8">
                  {[
                    { label: "Overall AI Score", score: scorecard.overallScore, large: true },
                    { label: "Value Score", score: scorecard.valueScore },
                    { label: "Location Score", score: scorecard.locationScore },
                    { label: "Lifestyle Score", score: lifestyleScore },
                    { label: "Investment Score", score: investmentScore },
                    { label: "Trust Score", score: scorecard.trustScore },
                  ].map(({ label, score, large }) => (
                    <div key={label} className={`flex flex-col items-center ${large ? "md:col-span-1" : ""}`}>
                      <ScoreRing score={Math.round(score)} large={large} />
                      <div className="text-[10px] text-center text-muted-foreground mt-1.5 leading-tight">{label}</div>
                      <div className={`text-[9px] font-bold uppercase tracking-wider mt-0.5 ${scoreRingColor(score)}`}>
                        {scoreLabel(score)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Radar Chart */}
                <div className="border-t border-border pt-6 pb-2">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-4">Score Radar</div>
                  <ResponsiveContainer width="100%" height={260}>
                    <RadarChart data={[
                      { subject: "Value", score: scorecard.valueScore },
                      { subject: "Location", score: scorecard.locationScore },
                      { subject: "Lifestyle", score: lifestyleScore },
                      { subject: "Investment", score: investmentScore },
                      { subject: "Trust", score: scorecard.trustScore },
                    ]}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                      />
                      <Radar
                        name="Score"
                        dataKey="score"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.15}
                        strokeWidth={2}
                      />
                      <RechartsTooltip
                        contentStyle={{
                          background: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "12px",
                          color: "hsl(var(--popover-foreground))",
                        }}
                        formatter={(v: number) => [`${v}/100`, "Score"]}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Breakdown */}
                <div className="space-y-3 border-t border-border pt-4">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-3">Score Breakdown</div>
                  {[
                    { label: "Value Score", score: scorecard.valueScore, explanation: scorecard.breakdown.valueExplanation },
                    { label: "Location Score", score: scorecard.locationScore, explanation: scorecard.breakdown.locationExplanation },
                    { label: "Lifestyle Score", score: lifestyleScore, explanation: `Based on ${amenityCount} listed amenities — ${lifestyleScore >= 70 ? "comprehensive amenity offering" : lifestyleScore >= 45 ? "moderate amenities" : "limited amenities listed"}` },
                    { label: "Investment Score", score: investmentScore, explanation: `Composite of location (45%), value (35%), trust (20%) — ${investmentScore >= 75 ? "strong investment potential" : investmentScore >= 55 ? "moderate investment outlook" : "developing investment case"}` },
                    { label: "Trust Score", score: scorecard.trustScore, explanation: scorecard.breakdown.trustExplanation },
                  ].map(({ label, score, explanation }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="w-24 shrink-0 text-right">
                        <span className={`font-mono font-bold text-sm ${scoreRingColor(score)}`}>{score}/100</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium mb-1">{label}</div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${score >= 75 ? "bg-green-500" : score >= 55 ? "bg-yellow-500" : "bg-red-500"}`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1">{explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Scorecard not available.</p>
            )}
          </CardContent>
        </Card>
      )}

      {tab === "ai-summary" && (
        <Card className="border-border">
          <CardHeader className="pb-3 pt-4 px-4 flex flex-row items-center justify-between">
            <CardTitle className="text-[11px] uppercase tracking-wider text-muted-foreground font-sans">AI Summary</CardTitle>
            <Button
              size="sm" className="gap-1.5 h-7 text-xs"
              onClick={() => generateSummary.mutate({ id: projectId })}
              disabled={generateSummary.isPending}
              data-testid="button-generate-summary"
            >
              <Sparkles className={`w-3.5 h-3.5 ${generateSummary.isPending ? "animate-pulse" : ""}`} />
              {generateSummary.isPending ? "Generating..." : project.hasSummary ? "Regenerate" : "Generate Summary"}
            </Button>
          </CardHeader>
          <CardContent className="px-4 pb-6">
            {project.hasSummary && project.aiSummary ? (
              <div className="space-y-5">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="text-[10px] uppercase tracking-wider text-primary/70 font-medium mb-2">Project Summary</div>
                  <p className="text-sm leading-relaxed" data-testid="text-ai-summary">{project.aiSummary}</p>
                </div>
                {project.investmentAngle && (
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2">Investment Angle</div>
                    <p className="text-sm leading-relaxed text-muted-foreground" data-testid="text-investment-angle">{project.investmentAngle}</p>
                  </div>
                )}
                {project.idealBuyerPersona && (
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2">Ideal Buyer Persona</div>
                    <p className="text-sm leading-relaxed text-muted-foreground" data-testid="text-ideal-buyer">{project.idealBuyerPersona}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center">
                <Sparkles className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm font-medium text-muted-foreground">No AI summary yet</p>
                <p className="text-xs text-muted-foreground/60 mt-1 max-w-xs mx-auto">
                  Generate a summary to make this project discoverable by AI tools and agents.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {tab === "api" && (
        <div className="space-y-4">
          <Card className="border-border">
            <CardHeader className="pb-3 pt-4 px-4">
              <CardTitle className="text-[11px] uppercase tracking-wider text-muted-foreground font-sans">API Endpoint</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="flex items-center gap-2 bg-muted/60 rounded-lg px-3 py-2.5 font-mono text-sm">
                <Badge variant="outline" className="text-[10px] border-green-500/40 text-green-700 font-mono shrink-0">GET</Badge>
                <span className="text-primary flex-1 break-all text-xs" data-testid="text-api-url">
                  /api/public/projects/{projectId}
                </span>
              </div>
              <div className="mt-3 flex gap-2">
                <Link href={`/projects/${projectId}/api`}>
                  <Button className="gap-1.5 h-8 text-xs" data-testid="button-view-api">
                    <Globe className="w-3.5 h-3.5" />
                    Open API Explorer
                  </Button>
                </Link>
                <Link href="/api-console">
                  <Button variant="outline" className="gap-1.5 h-8 text-xs">
                    Open API Console
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3 pt-4 px-4">
              <CardTitle className="text-[11px] uppercase tracking-wider text-muted-foreground font-sans">AI Integration Status</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-3">
              {[
                { label: "Public REST Endpoint", active: true, note: "Available at /api/public/projects/:id" },
                { label: "AI Summary", active: !!project.hasSummary, note: project.hasSummary ? "Generated — AI tools can use this" : "Not generated yet" },
                { label: "Scorecard Data", active: !!(project.overallScore), note: `Overall score: ${project.overallScore ? Number(project.overallScore).toFixed(1) : "—"}/100` },
              ].map(({ label, active, note }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${active ? "bg-green-500" : "bg-muted-foreground/30"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{label}</div>
                    <div className="text-xs text-muted-foreground">{note}</div>
                  </div>
                  <Badge variant={active ? "default" : "secondary"} className="text-[9px] uppercase shrink-0">
                    {active ? "Active" : "Pending"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
    </PageWrapper>
  );
}

function scoreRingColor(score?: number | null) {
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

function ScoreRing({ score, large }: { score: number; large?: boolean }) {
  const size = large ? 88 : 72;
  const radius = large ? 36 : 28;
  const strokeWidth = large ? 7 : 5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(score, 100) / 100) * circumference;
  const color = score >= 75 ? "#22c55e" : score >= 55 ? "#eab308" : "#ef4444";

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)", position: "absolute" }}>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="hsl(var(--muted))" strokeWidth={strokeWidth} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={color} strokeWidth={strokeWidth} fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className={`relative font-bold font-mono ${large ? "text-lg" : "text-sm"}`} style={{ color }}>
        {score}
      </span>
    </div>
  );
}
