import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/layout/header";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminQuestions from "@/pages/admin/questions";
import AdminStudents from "@/pages/admin/students";
import StudentLogin from "@/pages/student/login";
import StudentRegister from "@/pages/student/register";
import StudentDashboard from "@/pages/student/dashboard";
import StudentTest from "@/pages/student/test";
import StudentResults from "@/pages/student/results";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Switch>
        {/* Home route */}
        <Route path="/" component={() => (
          <>
            <Header />
            <Home />
          </>
        )} />

        {/* Admin routes */}
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route path="/admin/questions" component={AdminQuestions} />
        <Route path="/admin/students" component={AdminStudents} />

        {/* Student routes */}
        <Route path="/student/login" component={StudentLogin} />
        <Route path="/student/register" component={StudentRegister} />
        <Route path="/student/dashboard" component={StudentDashboard} />
        <Route path="/student/test/:courseId" component={StudentTest} />
        <Route path="/student/results/:testAttemptId" component={StudentResults} />

        {/* Fallback to 404 */}
        <Route component={() => (
          <>
            <Header />
            <NotFound />
          </>
        )} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
