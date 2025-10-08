import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAdminAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import AdminSidebar from "@/components/layout/admin-sidebar";
import { Shield, Download, LogOut, Eye } from "lucide-react";

interface StudentResult {
  studentId: string;
  studentName: string;
  email: string;
  courseName: string;
  score: number;
  attempts: number;
  lastTest: string;
}

export default function AdminStudents() {
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

  const { data: studentResults } = useQuery<StudentResult[]>({
    queryKey: ["/api/admin/student-results"],
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
  });

  const exportToCSV = () => {
    if (!studentResults || studentResults.length === 0) {
      toast({
        title: "No Data",
        description: "No student results to export",
        variant: "destructive",
      });
      return;
    }

    const csvContent = [
      ["Student ID", "Student Name", "Email", "Course", "Score", "Attempts", "Last Test"],
      ...studentResults.map(result => [
        result.studentId,
        result.studentName,
        result.email,
        result.courseName,
        `${result.score}%`,
        result.attempts.toString(),
        new Date(result.lastTest).toLocaleString()
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `student_results_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Success",
      description: "Student results exported successfully",
    });
  };

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
          <h2 className="text-xl font-semibold flex items-center">
            <Shield className="h-5 w-5 mr-3" />
            Administrator Dashboard
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm opacity-90">
              {admin?.firstName} {admin?.lastName}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logoutMutation.mutate()}
              className="bg-primary-foreground/20 hover:bg-primary-foreground/30"
              data-testid="button-admin-logout"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        
        <main className="flex-1 p-6">
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-foreground mb-2">Student Test Results</h3>
            <p className="text-muted-foreground">Monitor student performance and export data</p>
          </div>

          {/* Export Controls */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <Input 
                placeholder="Search students..." 
                className="w-64"
                data-testid="input-search"
              />
            </div>
            <Button 
              onClick={exportToCSV}
              className="bg-secondary hover:bg-secondary/90"
              data-testid="button-export"
            >
              <Download className="h-4 w-4 mr-2" />
              Export to CSV
            </Button>
          </div>

          {/* Results Table */}
          <Card>
            <CardHeader>
              <CardTitle>Student Results</CardTitle>
            </CardHeader>
            <CardContent>
              {studentResults && studentResults.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Student Name</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Email</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Course</th>
                        <th className="text-center py-3 px-4 text-muted-foreground font-medium">Score</th>
                        <th className="text-center py-3 px-4 text-muted-foreground font-medium">Attempts</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Last Test</th>
                        <th className="text-center py-3 px-4 text-muted-foreground font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentResults.map((result, index) => (
                        <tr key={index} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                                <span className="text-primary font-semibold text-sm">
                                  {result.studentName.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <span className="font-medium text-foreground">{result.studentName}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">{result.email}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-secondary/20 text-secondary rounded text-xs">
                              {result.courseName}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              result.score >= 80 
                                ? 'bg-chart-2/20 text-chart-2' 
                                : result.score >= 60 
                                ? 'bg-chart-1/20 text-chart-1'
                                : 'bg-destructive/20 text-destructive'
                            }`}>
                              {result.score}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center text-muted-foreground">{result.attempts}</td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {new Date(result.lastTest).toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex justify-center">
                              <Button
                                size="sm"
                                variant="ghost"
                                data-testid={`button-view-${result.studentId}`}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No student results found</p>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
