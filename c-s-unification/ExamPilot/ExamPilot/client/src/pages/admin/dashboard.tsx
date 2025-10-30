import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAdminAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import AdminSidebar from "@/components/layout/admin-sidebar";
import { Shield, Users, HelpCircle, ClipboardCheck, TrendingUp, LogOut } from "lucide-react";
// import { Link } from "wouter";

interface AdminStats {
  totalStudents: number;
  totalQuestions: number;
  testsToday: number;
  averageScore: number;
}

interface RecentActivity {
  studentName: string;
  courseName: string;
  score: number;
  completedAt: string;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { admin, isAuthenticated, isLoading } = useAdminAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        setLocation("/admin/login");
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast, setLocation]);

  const { data: stats } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
    retry: false,
    enabled: isAuthenticated,
  });

  const { data: recentActivity } = useQuery<RecentActivity[]>({
    queryKey: ["/api/admin/recent-activity"],
    retry: false,
    enabled: isAuthenticated,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/admin/logout");
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
      setLocation("/admin/login");
      window.location.reload();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          setLocation("/admin/login");
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Logout failed",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      {/* Admin Navigation */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-semibold flex items-center">
            <Shield className="h-5 w-5 mr-2 md:mr-3" />
            <span className="hidden sm:inline">Administrator Dashboard</span>
            <span className="sm:hidden">Admin</span>
          </h2>
          <div className="flex items-center space-x-2 md:space-x-4">
            <span className="text-xs md:text-sm opacity-90 hidden sm:inline" data-testid="text-admin-name">
              {admin?.firstName} {admin?.lastName}
            </span>
               {/* <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-xs md:text-sm"
              >
                <Home className="h-4 w-4 mr-0 md:mr-1" />
                <span className="hidden md:inline">Home</span>
              </Button>
            </Link> */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-xs md:text-sm"
              data-testid="button-admin-logout"
            >
              <LogOut className="h-4 w-4 mr-0 md:mr-1" />
              <span className="hidden md:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        
        <main className="flex-1 p-4 md:p-6">
          <div className="mb-6 md:mb-8">
            <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2">Dashboard Overview</h3>
            <p className="text-sm md:text-base text-muted-foreground">Monitor platform activity and performance metrics</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Students</p>
                    <p className="text-3xl font-semibold text-foreground" data-testid="stat-total-students">
                      {stats?.totalStudents || 0}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Questions</p>
                    <p className="text-3xl font-semibold text-foreground" data-testid="stat-total-questions">
                      {stats?.totalQuestions || 0}
                    </p>
                  </div>
                  <HelpCircle className="h-8 w-8 text-secondary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Tests Taken Today</p>
                    <p className="text-3xl font-semibold text-foreground" data-testid="stat-tests-today">
                      {stats?.testsToday || 0}
                    </p>
                  </div>
                  <ClipboardCheck className="h-8 w-8 text-chart-1" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Score</p>
                    <p className="text-3xl font-semibold text-foreground" data-testid="stat-avg-score">
                      {stats?.averageScore ? `${stats.averageScore.toFixed(1)}%` : "0%"}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-chart-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Test Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity && recentActivity.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-border">
                      <tr>
                        <th className="text-left py-2 text-muted-foreground font-medium">Student</th>
                        <th className="text-left py-2 text-muted-foreground font-medium">Course</th>
                        <th className="text-left py-2 text-muted-foreground font-medium">Score</th>
                        <th className="text-left py-2 text-muted-foreground font-medium">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivity.map((activity, index) => (
                        <tr key={index} className="border-b border-border">
                          <td className="py-2">{activity.studentName}</td>
                          <td className="py-2">{activity.courseName}</td>
                          <td className="py-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              activity.score >= 80 
                                ? 'bg-chart-2/20 text-chart-2' 
                                : activity.score >= 60 
                                ? 'bg-chart-1/20 text-chart-1'
                                : 'bg-destructive/20 text-destructive'
                            }`}>
                              {activity.score}%
                            </span>
                          </td>
                          <td className="py-2 text-muted-foreground">
                            {new Date(activity.completedAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No recent activity</p>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
