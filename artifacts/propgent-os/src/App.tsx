import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/Layout";
import { LandingPage } from "@/pages/LandingPage";
import { Dashboard } from "@/pages/Dashboard";
import { ProjectList } from "@/pages/ProjectList";
import { ProjectForm } from "@/pages/ProjectForm";
import { ProjectDetail } from "@/pages/ProjectDetail";
import { ApiExplorer } from "@/pages/ApiExplorer";
import { AIReports } from "@/pages/AIReports";
import { GlobalApiConsole } from "@/pages/GlobalApiConsole";

const queryClient = new QueryClient();

function AppRoutes() {
  return (
    <Switch>
      {/* Public landing page — no Layout */}
      <Route path="/" component={LandingPage} />

      {/* SaaS app routes — wrapped in Layout */}
      <Route>
        {() => (
          <Layout>
            <Switch>
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/projects" component={ProjectList} />
              <Route path="/projects/new">
                {() => <ProjectForm mode="create" />}
              </Route>
              <Route path="/projects/:id/edit">
                {() => <ProjectForm mode="edit" />}
              </Route>
              <Route path="/projects/:id/api" component={ApiExplorer} />
              <Route path="/projects/:id" component={ProjectDetail} />
              <Route path="/ai-reports" component={AIReports} />
              <Route path="/api-console" component={GlobalApiConsole} />
              <Route component={NotFound} />
            </Switch>
          </Layout>
        )}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AppRoutes />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
