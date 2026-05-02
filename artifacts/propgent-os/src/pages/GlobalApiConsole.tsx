import { useState, useRef } from "react";
import { useListProjects, getListProjectsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Terminal, Send, Copy, CheckCircle2, Clock, RefreshCw } from "lucide-react";

interface RequestLog {
  id: number;
  url: string;
  status: number;
  time: number;
  response: any;
  ts: Date;
}

export function GlobalApiConsole() {
  const { toast } = useToast();
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [endpoint, setEndpoint] = useState<"public" | "scorecard">("public");
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<RequestLog[]>([]);
  const [counter, setCounter] = useState(0);
  const logRef = useRef<HTMLDivElement>(null);

  const { data: projects } = useListProjects(undefined, {
    query: { queryKey: getListProjectsQueryKey() }
  });

  const endpointMap: Record<string, string> = {
    public: selectedProjectId ? `/api/public/projects/${selectedProjectId}` : "/api/public/projects/:id",
    scorecard: selectedProjectId ? `/api/projects/${selectedProjectId}/scorecard` : "/api/projects/:id/scorecard",
  };

  const activeUrl = endpointMap[endpoint];
  const domain = window.location.origin;
  const fullUrl = `${domain}${activeUrl}`;

  async function sendRequest() {
    if (!selectedProjectId) {
      toast({ title: "Select a project first", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    const start = Date.now();
    try {
      const res = await fetch(activeUrl, { headers: { Accept: "application/json" } });
      const data = await res.json();
      const elapsed = Date.now() - start;
      const id = counter + 1;
      setCounter(id);
      setLogs(prev => [{
        id,
        url: activeUrl,
        status: res.status,
        time: elapsed,
        response: data,
        ts: new Date(),
      }, ...prev].slice(0, 10));
      setTimeout(() => logRef.current?.scrollTo({ top: 0, behavior: "smooth" }), 50);
    } catch {
      toast({ title: "Request failed", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied to clipboard" });
    } catch {
      toast({ title: "Failed to copy", variant: "destructive" });
    }
  }

  const latestLog = logs[0];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[22px] font-bold tracking-tight">API Console</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Test and explore your project API endpoints in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Request Panel */}
        <div className="space-y-4">
          <Card className="border-border">
            <CardHeader className="pb-3 pt-4 px-4">
              <CardTitle className="text-[11px] uppercase tracking-wider text-muted-foreground font-sans">Request</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-3">
              {/* Project Selector */}
              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Select Project</label>
                <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                  <SelectTrigger data-testid="select-project">
                    <SelectValue placeholder="Choose a project..." />
                  </SelectTrigger>
                  <SelectContent>
                    {projects?.map(p => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.name} — {p.city ?? p.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Endpoint Selector */}
              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Endpoint</label>
                <div className="flex gap-2">
                  {(["public", "scorecard"] as const).map(ep => (
                    <button
                      key={ep}
                      onClick={() => setEndpoint(ep)}
                      className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                        endpoint === ep
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
                      }`}
                    >
                      {ep === "public" ? "Public Listing" : "Scorecard"}
                    </button>
                  ))}
                </div>
              </div>

              {/* URL Display */}
              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">URL</label>
                <div className="flex items-center gap-2 bg-muted/60 rounded-lg px-3 py-2.5 font-mono text-xs">
                  <Badge variant="outline" className="text-[9px] border-green-500/40 text-green-700 font-mono shrink-0">GET</Badge>
                  <span className="flex-1 text-primary break-all" data-testid="text-active-url">{fullUrl}</span>
                  <Button variant="ghost" size="icon" className="w-6 h-6 shrink-0" onClick={() => copyToClipboard(fullUrl)}>
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* Send Button */}
              <Button
                onClick={sendRequest}
                disabled={isLoading || !selectedProjectId}
                className="w-full gap-2"
                data-testid="button-send"
              >
                {isLoading ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> Sending...</>
                ) : (
                  <><Send className="w-4 h-4" /> Send Request</>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Code Snippets */}
          <Card className="border-border">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-[11px] uppercase tracking-wider text-muted-foreground font-sans">Example</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="relative">
                <Button
                  variant="ghost" size="icon" className="absolute top-2 right-2 w-6 h-6 z-10"
                  onClick={() => copyToClipboard(`curl "${fullUrl}" -H "Accept: application/json"`)}
                >
                  <Copy className="w-3 h-3" />
                </Button>
                <pre className="text-[11px] font-mono bg-muted/60 rounded-lg p-3 pr-9 overflow-x-auto">
                  {`curl "${fullUrl}" \\\n  -H "Accept: application/json"`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Response Panel */}
        <div className="space-y-4">
          {/* Latest Response */}
          <Card className={`border-border ${latestLog ? "border-green-500/20 bg-green-50/20" : ""}`}>
            <CardHeader className="pb-3 pt-4 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[11px] uppercase tracking-wider text-muted-foreground font-sans">Response</CardTitle>
                {latestLog && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-[11px] text-green-700">
                      <CheckCircle2 className="w-3 h-3" />
                      <span className="font-mono">{latestLog.status}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span className="font-mono">{latestLog.time}ms</span>
                    </div>
                    <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => copyToClipboard(JSON.stringify(latestLog.response, null, 2))}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {latestLog ? (
                <pre className="text-[11px] font-mono bg-muted/60 rounded-lg p-3 overflow-x-auto max-h-80 leading-relaxed" data-testid="text-response">
                  {JSON.stringify(latestLog.response, null, 2)}
                </pre>
              ) : (
                <div className="py-10 text-center">
                  <Terminal className="w-8 h-8 text-muted-foreground/20 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No requests yet</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Select a project and send a request</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Request History */}
          {logs.length > 1 && (
            <Card className="border-border">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-[11px] uppercase tracking-wider text-muted-foreground font-sans">Request History</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div ref={logRef} className="space-y-1.5 max-h-48 overflow-y-auto">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center gap-3 px-3 py-2 rounded-md bg-muted/40 text-[11px] font-mono cursor-pointer hover:bg-muted transition-colors"
                      onClick={() => setLogs(prev => [log, ...prev.filter(l => l.id !== log.id)])}
                    >
                      <span className="text-green-700 font-bold">{log.status}</span>
                      <span className="flex-1 text-muted-foreground truncate">{log.url}</span>
                      <span className="text-muted-foreground/60 shrink-0">{log.time}ms</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
