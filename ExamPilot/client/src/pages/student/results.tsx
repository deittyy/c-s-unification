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
  Trophy, 
  CheckCircle, 
  XCircle, 
  Home, 
  RotateCcw, 
  Download,
  GraduationCap,
  LogOut 
} from "lucide-react";

interface TestAttempt {
  id: string;
  courseId: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  completedAt: string;
}

interface TestAnswer {
  id: string;
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  questionText: string;
  correctAnswer: string;
}

interface TestResults {
  testAttempt: TestAttempt;
  answers: TestAnswer[];
}

export default function StudentResults() {
  const [, setLocation] = useLocation();
  const { student, isAuthenticated, isLoading } = useStudentAuth();
  const { toast } = useToast();

  // Extract testAttemptId from URL
  const testAttemptId = window.location.pathname.split('/').pop() || '';

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

  const { data: results } = useQuery<TestResults>({
    queryKey: ["/api/student/test/results", testAttemptId],
    retry: false,
    enabled: isAuthenticated && !!testAttemptId,
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
  });

  const downloadReport = () => {
    if (!results) return;

    const { testAttempt, answers } = results;
    
    // Normalize score for report
    const scoreForReport = typeof testAttempt.score === 'string' 
      ? parseFloat(testAttempt.score) 
      : (testAttempt.score ?? 0);
    
    const reportData = [
      `Test Results Report`,
      `Student: ${student?.firstName} ${student?.lastName}`,
      `Date: ${new Date(testAttempt.completedAt).toLocaleDateString()}`,
      `Score: ${scoreForReport.toFixed(1)}%`,
      `Correct Answers: ${testAttempt.correctAnswers}/${testAttempt.totalQuestions}`,
      `Time Spent: ${Math.floor(testAttempt.timeSpent / 60)}:${(testAttempt.timeSpent % 60).toString().padStart(2, '0')}`,
      ``,
      `Question Details:`,
      ...answers.map((answer, index) => 
        `${index + 1}. ${answer.isCorrect ? '✓' : '✗'} ${answer.questionText} (Selected: ${answer.selectedAnswer}, Correct: ${answer.correctAnswer})`
      )
    ].join('\n');

    const blob = new Blob([reportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `test_report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Report downloaded successfully",
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

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">Results Not Found</h3>
            <p className="text-muted-foreground mb-4">
              The test results could not be loaded.
            </p>
            <Button onClick={() => setLocation("/student/dashboard")}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { testAttempt, answers } = results;
  
  // Normalize score: convert string to number for consistent use
  const numericScore = typeof testAttempt.score === 'string' 
    ? parseFloat(testAttempt.score) 
    : (testAttempt.score ?? 0);
  
  const timeSpentMinutes = Math.floor(testAttempt.timeSpent / 60);
  const timeSpentSeconds = testAttempt.timeSpent % 60;
  const gradeMapping = {
    90: "A+", 85: "A", 80: "A-", 75: "B+", 70: "B", 65: "B-", 
    60: "C+", 55: "C", 50: "C-", 45: "D+", 40: "D", 0: "F"
  };
  const grade = Object.entries(gradeMapping)
    .find(([threshold]) => numericScore >= parseInt(threshold))?.[1] || "F";

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
            <span className="text-sm opacity-90">
              {student?.firstName} {student?.lastName}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logoutMutation.mutate()}
              className="bg-primary-foreground/20 hover:bg-primary-foreground/30"
              data-testid="button-student-logout"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Results Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-chart-2/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="h-12 w-12 text-chart-2" />
          </div>
          <h3 className="text-3xl font-bold text-foreground mb-2">Test Completed!</h3>
          <p className="text-lg text-muted-foreground">Here are your test results</p>
        </div>

        {/* Score Card */}
        <Card className="mb-8 bg-gradient-to-r from-chart-2/20 to-primary/20">
          <CardContent className="p-8 text-center">
            <div className="text-6xl font-bold text-foreground mb-2" data-testid="final-score">
              {numericScore.toFixed(1)}%
            </div>
            <p className="text-lg text-muted-foreground mb-4">Your Score</p>
            <div className="flex justify-center items-center space-x-8 text-sm">
              <div>
                <span className="block text-2xl font-semibold text-chart-2" data-testid="correct-count">
                  {testAttempt.correctAnswers}
                </span>
                <span className="text-muted-foreground">Correct</span>
              </div>
              <div>
                <span className="block text-2xl font-semibold text-destructive" data-testid="incorrect-count">
                  {testAttempt.totalQuestions - testAttempt.correctAnswers}
                </span>
                <span className="text-muted-foreground">Incorrect</span>
              </div>
              <div>
                <span className="block text-2xl font-semibold text-foreground" data-testid="total-count">
                  {testAttempt.totalQuestions}
                </span>
                <span className="text-muted-foreground">Total</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Results */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Performance Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Average Time per Question:</span>
                <span className="font-medium text-foreground" data-testid="avg-time">
                  {(testAttempt.timeSpent / testAttempt.totalQuestions / 60).toFixed(2)} min
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Accuracy Rate:</span>
                <span className="font-medium text-foreground">
                  {((testAttempt.correctAnswers / testAttempt.totalQuestions) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Questions Attempted:</span>
                <span className="font-medium text-foreground">
                  {testAttempt.totalQuestions} / {testAttempt.totalQuestions}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Time Taken:</span>
                <span className="font-medium text-foreground" data-testid="time-taken">
                  {timeSpentMinutes}:{timeSpentSeconds.toString().padStart(2, '0')} minutes
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Grade:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  testAttempt.score >= 80 
                    ? 'bg-chart-2/20 text-chart-2' 
                    : testAttempt.score >= 60 
                    ? 'bg-chart-1/20 text-chart-1'
                    : 'bg-destructive/20 text-destructive'
                }`} data-testid="grade">
                  {grade}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Completion Date:</span>
                <span className="font-medium text-foreground text-sm">
                  {new Date(testAttempt.completedAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Question Review */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Question-by-Question Review</CardTitle>
            <p className="text-sm text-muted-foreground">Review your answers and see the correct solutions</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {answers.map((answer, index) => (
                <div key={answer.id} className="border-b border-border last:border-b-0 pb-6 last:pb-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        Question {index + 1}
                      </span>
                      {answer.isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-chart-2" />
                      ) : (
                        <XCircle className="h-5 w-5 text-destructive" />
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      answer.isCorrect 
                        ? 'bg-chart-2/20 text-chart-2' 
                        : 'bg-destructive/20 text-destructive'
                    }`}>
                      {answer.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-foreground font-medium mb-2">{answer.questionText}</p>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground font-medium">Your Answer:</span>
                      <div className={`mt-1 p-2 rounded text-sm ${
                        answer.isCorrect 
                          ? 'bg-chart-2/10 text-chart-2 border border-chart-2/20' 
                          : 'bg-destructive/10 text-destructive border border-destructive/20'
                      }`}>
                        Option {answer.selectedAnswer}
                      </div>
                    </div>
                    
                    {!answer.isCorrect && (
                      <div>
                        <span className="text-muted-foreground font-medium">Correct Answer:</span>
                        <div className="mt-1 p-2 rounded text-sm bg-chart-2/10 text-chart-2 border border-chart-2/20">
                          Option {answer.correctAnswer}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button 
            variant="outline"
            onClick={() => setLocation("/student/dashboard")}
            data-testid="button-back-dashboard"
          >
            <Home className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <Button 
            onClick={() => setLocation(`/student/test/${testAttempt.courseId}`)}
            data-testid="button-retake-test"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Retake Test
          </Button>
          <Button 
            onClick={downloadReport}
            className="bg-secondary hover:bg-secondary/90"
            data-testid="button-download-report"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>
    </div>
  );
}
