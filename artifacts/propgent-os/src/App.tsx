import { Switch, Route, Router as WouterRouter, useLocation, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/Layout";
import { LandingPage } from "@/pages/LandingPage";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { Dashboard } from "@/pages/Dashboard";
import { ProjectList } from "@/pages/ProjectList";
import { ProjectForm } from "@/pages/ProjectForm";
import { ProjectDetail } from "@/pages/ProjectDetail";
import { ApiExplorer } from "@/pages/ApiExplorer";
import { AIReports } from "@/pages/AIReports";
import { GlobalApiConsole } from "@/pages/GlobalApiConsole";
import { Analytics } from "@/pages/Analytics";
import { Team } from "@/pages/Team";
import { Settings } from "@/pages/Settings";
import { Compare } from "@/pages/Compare";

const queryClient = new QueryClient();

function AuthenticatedApp() {
  const { user, isLoading } = useAuth();
  const [location] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B1F3A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#D4A843] border-t-transparent rounded-full animate-spin" />
          <p className="text-white/40 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Redirect to={`/login`} />;
  }

  return (
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
        <Route path="/analytics" component={Analytics} />
        <Route path="/compare" component={Compare} />
        <Route path="/team" component={Team} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route component={AuthenticatedApp} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <AppRoutes />
          </WouterRouter>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
