import { useState } from "react";
import { PageWrapper } from "@/components/PageWrapper";
import { useParams, Link } from "wouter";
import {
  useGetProjectApiEndpoint,
  useGetPublicProject,
  getGetProjectApiEndpointQueryKey,
  getGetPublicProjectQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Copy, Globe, RefreshCw, CheckCircle2, ExternalLink } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export function ApiExplorer() {
  const params = useParams();
  const projectId = parseInt(params.id!);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isTesting, setIsTesting] = useState(false);
  const [testResponse, setTestResponse] = useState<any>(null);

  const { data: apiInfo, isLoading } = useGetProjectApiEndpoint(projectId, {
    query: { enabled: !!projectId, queryKey: getGetProjectApiEndpointQueryKey(projectId) },
  });

  const { data: publicData, isLoading: isPublicLoading } = useGetPublicProject(projectId, {
    query: { enabled: !!projectId, queryKey: getGetPublicProjectQueryKey(projectId) },
  });

  async function copyToClipboard(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: `${label} copied to clipboard` });
    } catch {
      toast({ title: "Failed to copy", variant: "destructive" });
    }
  }

  async function testApi() {
    setIsTesting(true);
    try {
      const res = await fetch(`/api/public/projects/${projectId}`);
      const data = await res.json();
      setTestResponse(data);
      queryClient.invalidateQueries({ queryKey: getGetProjectApiEndpointQueryKey(projectId) });
      toast({ title: "API test successful" });
    } catch {
      toast({ title: "API test failed", variant: "destructive" });
    } finally {
      setIsTesting(false);
    }
  }

  const endpointUrl = apiInfo?.endpointUrl ?? `${window.location.origin}/api/public/projects/${projectId}`;

  return (
    <PageWrapper>
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href={`/projects/${projectId}`}>
          <Button variant="ghost" size="icon" className="w-8 h-8" data-testid="button-back">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-serif tracking-tight">API Explorer</h1>
          <p className="text-sm text-muted-foreground">Public AI-ready endpoint for project {projectId}</p>
        </div>
      </div>

      {/* Endpoint Card */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-sans">Public Endpoint</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-green-600 border-green-500/30">GET</Badge>
              <Badge variant="secondary">{isLoading ? "—" : apiInfo?.callCount ?? 0} calls</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 bg-muted/60 rounded-lg px-4 py-3 font-mono text-sm flex-wrap">
            <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="flex-1 break-all text-primary" data-testid="text-endpoint-url">{endpointUrl}</span>
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost" size="icon" className="w-7 h-7"
                onClick={() => copyToClipboard(endpointUrl, "Endpoint URL")}
                data-testid="button-copy-url"
              >
                <Copy className="w-3.5 h-3.5" />
              </Button>
              <a href={endpointUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="w-7 h-7" data-testid="button-open-url">
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </a>
            </div>
          </div>
          <Button
            onClick={testApi}
            disabled={isTesting}
            className="gap-2"
            data-testid="button-test-api"
          >
            <RefreshCw className={`w-4 h-4 ${isTesting ? "animate-spin" : ""}`} />
            {isTesting ? "Testing..." : "Test API"}
          </Button>
        </CardContent>
      </Card>

      {/* Test Response */}
      {testResponse && (
        <Card className="border-green-500/30 bg-green-50/30">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <CardTitle className="text-xs uppercase tracking-wider text-green-700 font-sans">Live Response</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Button
                variant="ghost" size="icon" className="absolute top-2 right-2 w-7 h-7 z-10"
                onClick={() => copyToClipboard(JSON.stringify(testResponse, null, 2), "Response JSON")}
                data-testid="button-copy-response"
              >
                <Copy className="w-3.5 h-3.5" />
              </Button>
              <pre className="text-xs font-mono bg-muted/60 rounded-lg p-4 overflow-x-auto max-h-96 leading-relaxed" data-testid="text-test-response">
                {JSON.stringify(testResponse, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Response Schema */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-sans">Sample Response</CardTitle>
            <Button
              variant="ghost" size="sm" className="gap-2 h-7 text-xs"
              onClick={() => copyToClipboard(
                JSON.stringify(publicData ?? apiInfo?.sampleResponse ?? {}, null, 2),
                "Sample JSON"
              )}
              data-testid="button-copy-sample"
            >
              <Copy className="w-3.5 h-3.5" /> Copy JSON
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isPublicLoading ? (
            <div className="space-y-2">
              {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-4 w-full" />)}
            </div>
          ) : (
            <pre className="text-xs font-mono bg-muted/60 rounded-lg p-4 overflow-x-auto max-h-[500px] leading-relaxed" data-testid="text-sample-response">
              {JSON.stringify(publicData ?? {}, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>

      {/* Integration Guide */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-sans">Integration Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">cURL</div>
            <div className="relative">
              <Button
                variant="ghost" size="icon" className="absolute top-2 right-2 w-7 h-7"
                onClick={() => copyToClipboard(`curl -X GET "${endpointUrl}" -H "Accept: application/json"`, "cURL command")}
                data-testid="button-copy-curl"
              >
                <Copy className="w-3.5 h-3.5" />
              </Button>
              <pre className="text-xs font-mono bg-muted/60 rounded-lg p-4 pr-10 overflow-x-auto">
                {`curl -X GET "${endpointUrl}" \\\n  -H "Accept: application/json"`}
              </pre>
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">JavaScript (fetch)</div>
            <div className="relative">
              <Button
                variant="ghost" size="icon" className="absolute top-2 right-2 w-7 h-7"
                onClick={() => copyToClipboard(
                  `const res = await fetch("${endpointUrl}");\nconst project = await res.json();\nconsole.log(project.scorecard.overallScore);`,
                  "JS snippet"
                )}
                data-testid="button-copy-js"
              >
                <Copy className="w-3.5 h-3.5" />
              </Button>
              <pre className="text-xs font-mono bg-muted/60 rounded-lg p-4 pr-10 overflow-x-auto">
                {`const res = await fetch("${endpointUrl}");\nconst project = await res.json();\nconsole.log(project.scorecard.overallScore);`}
              </pre>
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Python</div>
            <div className="relative">
              <Button
                variant="ghost" size="icon" className="absolute top-2 right-2 w-7 h-7"
                onClick={() => copyToClipboard(
                  `import requests\n\nproject = requests.get("${endpointUrl}").json()\nprint(project["scorecard"]["overallScore"])`,
                  "Python snippet"
                )}
                data-testid="button-copy-python"
              >
                <Copy className="w-3.5 h-3.5" />
              </Button>
              <pre className="text-xs font-mono bg-muted/60 rounded-lg p-4 pr-10 overflow-x-auto">
                {`import requests\n\nproject = requests.get("${endpointUrl}").json()\nprint(project["scorecard"]["overallScore"])`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </PageWrapper>
  );
}
