import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAuth";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAdminAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setLocation("/admin/dashboard");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  const loginMutation = useMutation({
    mutationFn: async (credentials: { adminId: string; password: string }) => {
      const response = await apiRequest("POST", "/api/admin/login", credentials);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
      setLocation("/admin/dashboard");
      window.location.reload(); // Refresh to update auth state
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Login failed",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminId || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate({ adminId, password });
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
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Admin Access</CardTitle>
          <p className="text-muted-foreground">Enter your admin credentials</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="adminId">Admin ID</Label>
              <Input
                id="adminId"
                type="text"
                placeholder="ADM001"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                required
                data-testid="input-admin-id"
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                data-testid="input-admin-password"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={loginMutation.isPending}
              data-testid="button-admin-login"
            >
              {loginMutation.isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
