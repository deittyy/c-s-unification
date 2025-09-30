import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useStudentAuth } from "@/hooks/useAuth";

export default function StudentRegister() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    studentId: "",
    password: "",
    confirmPassword: "",
  });
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useStudentAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setLocation("/student/dashboard");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  const registerMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/student/register", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Account created successfully",
      });
      setLocation("/student/dashboard");
      window.location.reload(); // Refresh to update auth state
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Registration failed",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.studentId || !formData.password || !formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    const { confirmPassword, ...registrationData } = formData;
    registerMutation.mutate(registrationData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="h-8 w-8 text-secondary" />
          </div>
          <CardTitle className="text-2xl">Student Registration</CardTitle>
          <p className="text-muted-foreground">Create your account to get started</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                  data-testid="input-first-name"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                  data-testid="input-last-name"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                data-testid="input-email"
              />
            </div>
            
            <div>
              <Label htmlFor="studentId">Student ID</Label>
              <Input
                id="studentId"
                type="text"
                placeholder="STU12345"
                value={formData.studentId}
                onChange={(e) => handleInputChange('studentId', e.target.value)}
                required
                data-testid="input-student-id"
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                data-testid="input-password"
              />
            </div>
            
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                required
                data-testid="input-confirm-password"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-secondary hover:bg-secondary/90"
              disabled={registerMutation.isPending}
              data-testid="button-register"
            >
              {registerMutation.isPending ? "Creating account..." : "Create Account"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/student/login">
                <Button variant="link" className="p-0 h-auto text-secondary" data-testid="link-login">
                  Sign in here
                </Button>
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
