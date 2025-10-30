import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useStudentAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { 
  GraduationCap, 
  CheckCircle, 
  TrendingUp, 
  BookOpen, 
  Calculator, 
  Atom, 
  FlaskConical, 
  Dna,
  LogOut,
  Home
} from "lucide-react";
import { Link } from "wouter";

interface Course {
  id: string;
  name: string;
  description: string;
  duration: number;
}

interface TestHistory {
  id: string;
  courseName: string;
  score: number;
  completedAt: string;
  correctAnswers: number;
  totalQuestions: number;
}

const courseIcons = {
  Mathematics: Calculator,
  Physics: Atom,
  Chemistry: FlaskConical,
  Biology: Dna,
};

export default function StudentDashboard() {
  const [, setLocation] = useLocation();
  const { student, isAuthenticated, isLoading } = useStudentAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        setLocation("/student/login");
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast, setLocation]);

  const { data: courses } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
    retry: false,
    enabled: isAuthenticated,
  });

  const { data: testHistory } = useQuery<TestHistory[]>({
    queryKey: ["/api/student/test/history"],
    retry: false,
    enabled: isAuthenticated,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/student/logout");
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
      setLocation("/student/login");
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
          setLocation("/student/login");
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

  const startTest = (courseId: string) => {
    setLocation(`/student/test/${courseId}`);
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

  const testsCompleted = testHistory?.length || 0;
  const averageScore = testHistory?.length 
    ? testHistory.reduce((sum, test) => sum + test.score, 0) / testHistory.length 
    : 0;
  const activeCourses = courses?.length || 0;

  return (
    <div>
      {/* Student Navigation */}
      <div className="bg-secondary text-primary-foreground p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center">
            <GraduationCap className="h-5 w-5 mr-3" />
            Student Portal
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm opacity-90" data-testid="text-student-name">
              {student?.firstName} {student?.lastName}
            </span>
             <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="bg-primary-foreground/20 hover:bg-primary-foreground/30"
              >
                <Home className="h-4 w-4 mr-1" />
                Home
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="bg-primary-foreground/20 hover:bg-primary-foreground/30"
              data-testid="button-student-logout"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-secondary/10 to-primary/10 rounded-lg p-6 mb-8">
          <h3 className="text-2xl font-semibold text-foreground mb-2">
            Welcome back, {student?.firstName}!
          </h3>
          <p className="text-muted-foreground">Ready to continue your learning journey? Select a course to begin testing.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tests Completed</p>
                  <p className="text-2xl font-semibold text-foreground" data-testid="stat-tests-completed">
                    {testsCompleted}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-chart-2" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                  <p className="text-2xl font-semibold text-foreground" data-testid="stat-average-score">
                    {averageScore.toFixed(1)}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Courses</p>
                  <p className="text-2xl font-semibold text-foreground" data-testid="stat-active-courses">
                    {activeCourses}
                  </p>
                </div>
                <BookOpen className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Courses */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-foreground mb-4">Available Courses</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses?.map((course) => {
              const IconComponent = courseIcons[course.name as keyof typeof courseIcons] || BookOpen;
              return (
                <Card 
                  key={course.id} 
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => startTest(course.id)}
                  data-testid={`card-course-${course.id}`}
                >
                  <div className="course-badge h-24 flex items-center justify-center">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <CardContent className="p-4">
                    <h5 className="font-semibold text-foreground mb-2">{course.name}</h5>
                    <p className="text-sm text-muted-foreground mb-3">{course.description}</p>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>{course.duration} mins</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Test History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            {testHistory && testHistory.length > 0 ? (
              <div className="space-y-4">
                {testHistory.slice(0, 5).map((test) => {
                  const IconComponent = courseIcons[test.courseName as keyof typeof courseIcons] || BookOpen;
                  return (
                    <div key={test.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                          <IconComponent className="h-5 w-5 text-secondary" />
                        </div>
                        <div>
                          <h5 className="font-medium text-foreground">{test.courseName} Test</h5>
                          <p className="text-sm text-muted-foreground">
                            {new Date(test.completedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-foreground">{test.score}%</p>
                        <p className="text-sm text-muted-foreground">
                          {test.correctAnswers}/{test.totalQuestions} correct
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No test history yet. Take your first test!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
