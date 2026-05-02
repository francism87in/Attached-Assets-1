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
import { Building2, Activity, FileText, Globe, ArrowRight, Plus } from "lucide-react";
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-serif tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">System status and portfolio metrics.</p>
        </div>
        <Link href="/projects/new" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2">
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Projects" 
          value={stats?.totalProjects} 
          icon={Building2} 
          isLoading={isStatsLoading} 
        />
        <StatCard 
          title="Active Projects" 
          value={stats?.activeProjects} 
          icon={Activity} 
          isLoading={isStatsLoading} 
        />
        <StatCard 
          title="API Calls (30d)" 
          value={stats?.totalApiCalls} 
          icon={Globe} 
          isLoading={isStatsLoading} 
        />
        <StatCard 
          title="Avg Overall Score" 
          value={stats?.avgOverallScore ? `${stats.avgOverallScore}/100` : undefined} 
          icon={FileText} 
          isLoading={isStatsLoading} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold font-serif">Recent Projects</h2>
            <Link href="/projects" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          
          <Card className="border-border">
            <div className="divide-y divide-border">
              {isProjectsLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="p-4 flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-3 w-[150px]" />
                    </div>
                    <Skeleton className="h-8 w-[100px]" />
                  </div>
                ))
              ) : projects?.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No projects found. Create one to get started.
                </div>
              ) : (
                projects?.slice(0, 5).map(project => (
                  <div key={project.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                    <div>
                      <Link href={`/projects/${project.id}`} className="font-medium hover:text-primary transition-colors flex items-center gap-2">
                        {project.name}
                        {project.status === "active" ? (
                          <Badge variant="default" className="text-[10px] uppercase h-5">Active</Badge>
                        ) : project.status === "draft" ? (
                          <Badge variant="secondary" className="text-[10px] uppercase h-5">Draft</Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] uppercase h-5">Archived</Badge>
                        )}
                      </Link>
                      <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                        <span>{project.developerName}</span>
                        <span>•</span>
                        <span>{project.location}, {project.city}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-right">
                      <div className="hidden sm:block">
                        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Score</div>
                        <div className="font-mono text-sm font-medium">{project.overallScore || 0}/100</div>
                      </div>
                      <Link href={`/projects/${project.id}`} className="p-2 text-muted-foreground hover:text-primary transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold font-serif">System Activity</h2>
          
          <Card className="border-border">
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {isActivityLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <div key={i} className="p-4 space-y-2">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-2 w-[100px]" />
                    </div>
                  ))
                ) : activity?.length === 0 ? (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    No recent activity.
                  </div>
                ) : (
                  activity?.map(item => (
                    <div key={item.id} className="p-4 text-sm">
                      <div className="flex items-start justify-between gap-4">
                        <span className="text-muted-foreground">
                          <span className="text-foreground font-medium">{item.projectName}</span>: {item.action}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2 font-mono">
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

function StatCard({ title, value, icon: Icon, isLoading }: { title: string, value: any, icon: any, isLoading: boolean }) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-sans uppercase tracking-wider text-muted-foreground">{title}</CardTitle>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-[100px]" />
        ) : (
          <div className="text-2xl font-bold font-mono tracking-tight">{value ?? "-"}</div>
        )}
      </CardContent>
    </Card>
  );
}
