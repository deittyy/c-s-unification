import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useStudentAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Timer from "@/components/test/timer";
import QuestionCard from "@/components/test/question-card";
import { 
  GraduationCap, 
  ChevronLeft, 
  ChevronRight, 
  Flag, 
  Send,
  LogOut 
} from "lucide-react";

interface Question {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
}

interface Course {
  id: string;
  name: string;
  description: string;
  duration: number;
}

interface TestAttempt {
  id: string;
  courseId: string;
  startedAt: string;
}

export default function StudentTest() {
  const [, setLocation] = useLocation();
  const { student, isAuthenticated, isLoading } = useStudentAuth();
  const { toast } = useToast();

  // Extract courseId from URL
  const courseId = window.location.pathname.split('/').pop() || '';
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const [testAttempt, setTestAttempt] = useState<TestAttempt | null>(null);
  const [timeUp, setTimeUp] = useState(false);

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

  const course = courses?.find((c: Course) => c.id === courseId);

  const { data: questions } = useQuery<Question[]>({
    queryKey: ["/api/questions", courseId],
    retry: false,
    enabled: isAuthenticated && !!courseId,
  });

  const startTestMutation = useMutation({
    mutationFn: async (data: { courseId: string }) => {
      const response = await apiRequest("POST", "/api/student/test/start", data);
      return response.json();
    },
    onSuccess: (data) => {
      setTestAttempt(data);
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
        description: "Failed to start test",
        variant: "destructive",
      });
    },
  });

  const saveAnswerMutation = useMutation({
    mutationFn: async (data: {
      testAttemptId: string;
      questionId: string;
      selectedAnswer: string;
      isCorrect: boolean;
    }) => {
      const response = await apiRequest("POST", "/api/student/test/answer", data);
      return response.json();
    },
  });

  const completeTestMutation = useMutation({
    mutationFn: async (data: {
      testAttemptId: string;
      timeSpent: number;
    }) => {
      const response = await apiRequest("POST", "/api/student/test/complete", data);
      return response.json();
    },
    onSuccess: (data) => {
      setLocation(`/student/results/${data.id}`);
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
        description: "Failed to complete test",
        variant: "destructive",
      });
    },
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

  // Initialize test on component mount
  useEffect(() => {
    if (isAuthenticated && courseId && !testAttempt) {
      startTestMutation.mutate({ courseId });
    }
  }, [isAuthenticated, courseId, testAttempt]);

  const handleAnswerChange = (answer: string) => {
    if (!questions || !testAttempt) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));

    // Save answer to backend (assuming we have the correct answer from questions)
    // Note: In a real implementation, correct answers wouldn't be available to students
    saveAnswerMutation.mutate({
      testAttemptId: testAttempt.id,
      questionId: currentQuestion.id,
      selectedAnswer: answer,
      isCorrect: false, // This would be calculated on the backend
    });
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (!questions) return;
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleFlagQuestion = () => {
    if (!questions) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    const newFlagged = new Set(flaggedQuestions);
    
    if (flaggedQuestions.has(currentQuestion.id)) {
      newFlagged.delete(currentQuestion.id);
    } else {
      newFlagged.add(currentQuestion.id);
    }
    
    setFlaggedQuestions(newFlagged);
  };

  const handleSubmitTest = () => {
    if (!testAttempt || !questions) return;

    const timeSpent = course ? (course.duration * 60) - (timeUp ? 0 : 60) : 0; // Simplified time calculation

    completeTestMutation.mutate({
      testAttemptId: testAttempt.id,
      timeSpent,
    });
  };

  const handleTimeUp = () => {
    setTimeUp(true);
    handleSubmitTest();
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

  if (!course || !questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">Course Not Found</h3>
            <p className="text-muted-foreground mb-4">
              The selected course or questions could not be loaded.
            </p>
            <Button onClick={() => setLocation("/student/dashboard")}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

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
        {/* Test Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-foreground" data-testid="test-title">
                  {course.name} Test
                </h3>
                <p className="text-muted-foreground">{course.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Time Remaining</p>
                <Timer 
                  initialSeconds={course.duration * 20} 
                  onTimeUp={handleTimeUp}
                />
              </div>
            </div>
            
            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span data-testid="progress-text">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span>{Math.round(progressPercentage)}% Complete</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Question Card */}
        <QuestionCard
          question={currentQuestion}
          selectedAnswer={answers[currentQuestion.id] || ""}
          onAnswerChange={handleAnswerChange}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
        />

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            data-testid="button-previous"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex space-x-4">
            <Button
              variant="secondary"
              onClick={handleFlagQuestion}
              data-testid="button-flag"
            >
              <Flag className={`h-4 w-4 mr-2 ${flaggedQuestions.has(currentQuestion.id) ? 'fill-current' : ''}`} />
              {flaggedQuestions.has(currentQuestion.id) ? 'Unflag' : 'Flag'} Question
            </Button>
            
            {isLastQuestion ? (
              <Button
                onClick={handleSubmitTest}
                disabled={completeTestMutation.isPending}
                className="bg-destructive hover:bg-destructive/90"
                data-testid="button-submit-test"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Test
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                data-testid="button-next"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
