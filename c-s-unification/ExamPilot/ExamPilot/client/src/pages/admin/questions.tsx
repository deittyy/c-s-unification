import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAdminAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import AdminSidebar from "@/components/layout/admin-sidebar";
import { Shield, Plus, Edit, Trash2, LogOut } from "lucide-react";

interface Question {
  id: string;
  courseId: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  difficulty: string;
  createdAt: string;
  courseName: string;
}

interface Course {
  id: string;
  name: string;
}

export default function AdminQuestions() {
  const [, setLocation] = useLocation();
  const { admin, isAuthenticated, isLoading } = useAdminAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [formData, setFormData] = useState({
    courseId: "",
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "",
    difficulty: "medium",
  });
  const [courseFormData, setCourseFormData] = useState({
    name: "",
    description: "",
    duration: 20,
  });

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

  const { data: questions } = useQuery<Question[]>({
    queryKey: ["/api/admin/questions"],
    retry: false,
    enabled: isAuthenticated,
  });

  const { data: courses } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
    retry: false,
    enabled: isAuthenticated,
  });

  const createQuestionMutation = useMutation({
    mutationFn: async (questionData: any) => {
      const response = await apiRequest("POST", "/api/admin/questions", questionData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Question created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/questions"] });
      setShowForm(false);
      resetForm();
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
        description: error.message || "Failed to create question",
        variant: "destructive",
      });
    },
  });

  const updateQuestionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await apiRequest("PUT", `/api/admin/questions/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Question updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/questions"] });
      setEditingQuestion(null);
      setShowForm(false);
      resetForm();
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
        description: error.message || "Failed to update question",
        variant: "destructive",
      });
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/questions/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Question deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/questions"] });
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
        description: error.message || "Failed to delete question",
        variant: "destructive",
      });
    },
  });

  const createCourseMutation = useMutation({
    mutationFn: async (courseData: { name: string; description: string; duration: number }) => {
      await apiRequest("POST", "/api/admin/courses", courseData);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Course created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      setShowCourseForm(false);
      setCourseFormData({ name: "", description: "", duration: 15 });
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
        description: error.message || "Failed to create course",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      courseId: "",
      questionText: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "",
      difficulty: "medium",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingQuestion) {
      updateQuestionMutation.mutate({ id: editingQuestion.id, data: formData });
    } else {
      createQuestionMutation.mutate(formData);
    }
  };

  const handleCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCourseMutation.mutate(courseFormData);
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setFormData({
      courseId: question.courseId,
      questionText: question.questionText,
      optionA: question.optionA,
      optionB: question.optionB,
      optionC: question.optionC,
      optionD: question.optionD,
      correctAnswer: question.correctAnswer,
      difficulty: question.difficulty,
    });
    setShowForm(true);
  };

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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2">Question & Course Management</h3>
              <p className="text-sm md:text-base text-muted-foreground">Create, edit, and organize questions and courses</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline"
                onClick={() => setShowCourseForm(true)}
                data-testid="button-add-course"
                className="text-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Course
              </Button>
              <Button 
                onClick={() => {
                  setEditingQuestion(null);
                  resetForm();
                  setShowForm(true);
                }}
                data-testid="button-add-question"
                className="text-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>
          </div>

          {showForm && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>
                  {editingQuestion ? "Edit Question" : "Add New Question"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="courseId">Course</Label>
                    <Select value={formData.courseId} onValueChange={(value) => setFormData({ ...formData, courseId: value })}>
                      <SelectTrigger data-testid="select-course">
                        <SelectValue placeholder="Select Course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses?.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="questionText">Question Text</Label>
                    <Textarea
                      id="questionText"
                      value={formData.questionText}
                      onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                      placeholder="Enter your question here..."
                      required
                      data-testid="textarea-question"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="optionA">Option A</Label>
                      <Input
                        id="optionA"
                        value={formData.optionA}
                        onChange={(e) => setFormData({ ...formData, optionA: e.target.value })}
                        placeholder="Enter option A"
                        required
                        data-testid="input-option-a"
                      />
                    </div>
                    <div>
                      <Label htmlFor="optionB">Option B</Label>
                      <Input
                        id="optionB"
                        value={formData.optionB}
                        onChange={(e) => setFormData({ ...formData, optionB: e.target.value })}
                        placeholder="Enter option B"
                        required
                        data-testid="input-option-b"
                      />
                    </div>
                    <div>
                      <Label htmlFor="optionC">Option C</Label>
                      <Input
                        id="optionC"
                        value={formData.optionC}
                        onChange={(e) => setFormData({ ...formData, optionC: e.target.value })}
                        placeholder="Enter option C"
                        required
                        data-testid="input-option-c"
                      />
                    </div>
                    <div>
                      <Label htmlFor="optionD">Option D</Label>
                      <Input
                        id="optionD"
                        value={formData.optionD}
                        onChange={(e) => setFormData({ ...formData, optionD: e.target.value })}
                        placeholder="Enter option D"
                        required
                        data-testid="input-option-d"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="correctAnswer">Correct Answer</Label>
                      <Select value={formData.correctAnswer} onValueChange={(value) => setFormData({ ...formData, correctAnswer: value })}>
                        <SelectTrigger data-testid="select-correct-answer">
                          <SelectValue placeholder="Select Correct Answer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">Option A</SelectItem>
                          <SelectItem value="B">Option B</SelectItem>
                          <SelectItem value="C">Option C</SelectItem>
                          <SelectItem value="D">Option D</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="difficulty">Difficulty Level</Label>
                      <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
                        <SelectTrigger data-testid="select-difficulty">
                          <SelectValue placeholder="Select Difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        setShowForm(false);
                        setEditingQuestion(null);
                        resetForm();
                      }}
                      data-testid="button-cancel"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={createQuestionMutation.isPending || updateQuestionMutation.isPending}
                      data-testid="button-save-question"
                    >
                      {editingQuestion ? "Update Question" : "Save Question"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {showCourseForm && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Add New Course</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCourseSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="courseName">Course Name</Label>
                    <Input
                      id="courseName"
                      value={courseFormData.name}
                      onChange={(e) => setCourseFormData({ ...courseFormData, name: e.target.value })}
                      placeholder="Enter course name"
                      required
                      data-testid="input-course-name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="courseDescription">Course Description</Label>
                    <Textarea
                      id="courseDescription"
                      value={courseFormData.description}
                      onChange={(e) => setCourseFormData({ ...courseFormData, description: e.target.value })}
                      placeholder="Enter course description"
                      required
                      data-testid="textarea-course-description"
                    />
                  </div>

                  <div>
                    <Label htmlFor="courseDuration">Test Duration (minutes)</Label>
                    <Input
                      id="courseDuration"
                      type="number"
                      value={courseFormData.duration}
                      onChange={(e) => setCourseFormData({ ...courseFormData, duration: parseInt(e.target.value) || 60 })}
                      placeholder="Duration in minutes"
                      min="1"
                      required
                      data-testid="input-course-duration"
                    />
                  </div>

                  <div className="flex justify-end space-x-4 pt-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        setShowCourseForm(false);
                        setCourseFormData({ name: "", description: "", duration: 60 });
                      }}
                      data-testid="button-cancel-course"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={createCourseMutation.isPending}
                      data-testid="button-save-course"
                    >
                      {createCourseMutation.isPending ? "Creating..." : "Create Course"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Questions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Questions</CardTitle>
            </CardHeader>
            <CardContent>
              {questions && questions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Question</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Course</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Difficulty</th>
                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Created</th>
                        <th className="text-center py-3 px-4 text-muted-foreground font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {questions.map((question) => (
                        <tr key={question.id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div className="max-w-md">
                              <p className="font-medium text-foreground">{question.questionText}</p>
                              <p className="text-sm text-muted-foreground mt-1">Multiple Choice • 4 options</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-secondary/20 text-secondary rounded text-xs">
                              {question.courseName}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs ${
                              question.difficulty === 'easy' 
                                ? 'bg-chart-2/20 text-chart-2' 
                                : question.difficulty === 'medium'
                                ? 'bg-chart-3/20 text-chart-3'
                                : 'bg-destructive/20 text-destructive'
                            }`}>
                              {question.difficulty}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {new Date(question.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex justify-center space-x-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(question)}
                                data-testid={`button-edit-${question.id}`}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteQuestionMutation.mutate(question.id)}
                                disabled={deleteQuestionMutation.isPending}
                                data-testid={`button-delete-${question.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No questions found</p>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
