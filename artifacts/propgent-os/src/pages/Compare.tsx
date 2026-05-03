import { useState } from "react";
import { PageWrapper } from "@/components/PageWrapper";
import { useListProjects, getListProjectsQueryKey, useGetProjectScorecard, getGetProjectScorecardQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { BarChart2, Plus, X, ArrowRight, Minus } from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  Legend, Tooltip as RechartsTooltip,
} from "recharts";

const COLORS = ["#D4A843", "#3B82F6", "#10B981"];
const SCORE_LABELS = ["Value", "Location", "Trust"];

function scoreColor(score?: number | null) {
  if (!score) return "text-muted-foreground";
  if (score >= 75) return "text-green-600";
  if (score >= 55) return "text-yellow-600";
  return "text-red-500";
}

function ScoreBadge({ score }: { score?: number | null }) {
  if (!score) return <span className="text-muted-foreground font-mono text-sm">—</span>;
  return (
    <span className={`font-mono font-bold text-lg ${scoreColor(score)}`}>
      {Math.round(score)}
    </span>
  );
}

function ProjectSelector({ selectedIds, onAdd, onRemove }: {
  selectedIds: number[];
  onAdd: (id: number) => void;
  onRemove: (id: number) => void;
}) {
  const { data: projects, isLoading } = useListProjects(undefined, {
    query: { queryKey: getListProjectsQueryKey() }
  });

  const available = projects?.filter(p => !selectedIds.includes(p.id)) ?? [];

  return (
    <div className="space-y-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
        Select up to 3 projects
      </div>
      <div className="flex flex-wrap gap-2">
        {selectedIds.map((id, idx) => {
          const p = projects?.find(x => x.id === id);
          return (
            <div
              key={id}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium border text-white"
              style={{ borderColor: COLORS[idx], background: COLORS[idx] + "22", color: COLORS[idx] }}
            >
              <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ background: COLORS[idx] }} />
              {p?.name ?? `Project ${id}`}
              <button onClick={() => onRemove(id)} className="ml-1 hover:opacity-70 transition-opacity">
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}
        {selectedIds.length < 3 && available.length > 0 && (
          <select
            value=""
            onChange={e => { if (e.target.value) onAdd(Number(e.target.value)); }}
            className="h-7 px-3 rounded-full border border-dashed border-border bg-background text-[12px] text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
          >
            <option value="">+ Add project…</option>
            {isLoading ? (
              <option disabled>Loading…</option>
            ) : (
              available.map(p => <option key={p.id} value={p.id}>{p.name}</option>)
            )}
          </select>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ projectId, colorIdx }: { projectId: number; colorIdx: number }) {
  const { data: projects } = useListProjects(undefined, { query: { queryKey: getListProjectsQueryKey() } });
  const project = projects?.find(p => p.id === projectId);

  const color = COLORS[colorIdx];

  return (
    <Card className="border-border flex-1 min-w-0" style={{ borderTopColor: color, borderTopWidth: 2 }}>
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="font-semibold text-[14px] leading-tight">{project?.name}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">{project?.location}{project?.city ? `, ${project.city}` : ""}</div>
          </div>
          <Badge variant="outline" className="text-[9px] shrink-0 capitalize">{project?.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-3">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {[
            { label: "Overall", score: project?.overallScore },
            { label: "Value", score: project?.valueScore },
            { label: "Location", score: project?.locationScore },
            { label: "Trust", score: project?.trustScore },
          ].map(({ label, score }) => (
            <div key={label}>
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground mb-0.5">{label}</div>
              <ScoreBadge score={score} />
            </div>
          ))}
        </div>
        {project?.developerName && (
          <div className="text-[11px] text-muted-foreground border-t border-border pt-2">
            <span className="font-medium text-foreground">{project.developerName}</span>
            {project.possessionDate && <span> · {project.possessionDate}</span>}
          </div>
        )}
        <Link href={`/projects/${projectId}`} className="text-[11px] text-primary flex items-center gap-1 hover:underline">
          View detail <ArrowRight className="w-3 h-3" />
        </Link>
      </CardContent>
    </Card>
  );
}

export function Compare() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { data: projects } = useListProjects(undefined, { query: { queryKey: getListProjectsQueryKey() } });

  function addProject(id: number) {
    if (selectedIds.length < 3) setSelectedIds(prev => [...prev, id]);
  }

  function removeProject(id: number) {
    setSelectedIds(prev => prev.filter(x => x !== id));
  }

  const radarData = SCORE_LABELS.map(label => {
    const row: Record<string, number | string> = { label };
    selectedIds.forEach((id, idx) => {
      const p = projects?.find(x => x.id === id);
      const score =
        label === "Value" ? (p?.valueScore ?? 0) :
        label === "Location" ? (p?.locationScore ?? 0) :
        label === "Trust" ? (p?.trustScore ?? 0) : 0;
      row[`proj_${idx}`] = Math.round(score);
    });
    return row;
  });

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
        <h1 className="text-[22px] font-bold tracking-tight flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-primary" />
          Compare Projects
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">Compare AI scores and metrics side-by-side across up to 3 projects.</p>
      </div>

      {/* Selector */}
      <Card className="border-border">
        <CardContent className="p-4">
          <ProjectSelector selectedIds={selectedIds} onAdd={addProject} onRemove={removeProject} />
        </CardContent>
      </Card>

      {selectedIds.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <BarChart2 className="w-12 h-12 text-muted-foreground mb-4 opacity-40" />
          <div className="text-muted-foreground font-medium">Select at least one project to start comparing</div>
          <div className="text-sm text-muted-foreground mt-1">Use the selector above to pick up to 3 projects</div>
        </div>
      ) : (
        <>
          {/* Project Cards */}
          <div className="flex flex-col md:flex-row gap-4">
            {selectedIds.map((id, idx) => (
              <ProjectCard key={id} projectId={id} colorIdx={idx} />
            ))}
          </div>

          {/* Radar Chart */}
          {selectedIds.length >= 2 && (
            <Card className="border-border">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-[11px] uppercase tracking-wider text-muted-foreground font-sans">Score Radar Comparison</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={radarData} margin={{ top: 8, right: 32, bottom: 8, left: 32 }}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="label" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                    {selectedIds.map((id, idx) => {
                      const p = projects?.find(x => x.id === id);
                      return (
                        <Radar
                          key={id}
                          name={p?.name ?? `Project ${idx + 1}`}
                          dataKey={`proj_${idx}`}
                          stroke={COLORS[idx]}
                          fill={COLORS[idx]}
                          fillOpacity={0.12}
                          strokeWidth={2}
                        />
                      );
                    })}
                    <RechartsTooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Score Comparison Table */}
          <Card className="border-border overflow-hidden">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-[11px] uppercase tracking-wider text-muted-foreground font-sans">Score Breakdown</CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-left px-4 py-2 text-[10px] uppercase tracking-wider text-muted-foreground font-medium w-32">Metric</th>
                    {selectedIds.map((id, idx) => {
                      const p = projects?.find(x => x.id === id);
                      return (
                        <th key={id} className="text-center px-4 py-2 text-[10px] uppercase tracking-wider font-medium" style={{ color: COLORS[idx] }}>
                          {p?.name ?? `Project ${idx + 1}`}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { label: "Overall Score", key: "overallScore" as const },
                    { label: "Value Score", key: "valueScore" as const },
                    { label: "Location Score", key: "locationScore" as const },
                    { label: "Trust Score", key: "trustScore" as const },
                    { label: "API Calls", key: "apiCallCount" as const },
                  ].map(({ label, key }) => {
                    const scores = selectedIds.map(id => {
                      const p = projects?.find(x => x.id === id);
                      return p ? (p[key] as number | undefined) : undefined;
                    });
                    const max = Math.max(...scores.map(s => s ?? 0));
                    return (
                      <tr key={label} className="hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3 text-[12px] text-muted-foreground">{label}</td>
                        {scores.map((score, idx) => (
                          <td key={idx} className="px-4 py-3 text-center">
                            <div className={`font-mono font-bold text-sm ${scoreColor(score)}`}>
                              {score !== undefined && score !== null ? Math.round(score) : "—"}
                            </div>
                            {score === max && max > 0 && scores.filter(s => s === max).length === 1 && (
                              <div className="text-[9px] text-green-600 mt-0.5">Best</div>
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
    </PageWrapper>
  );
}
