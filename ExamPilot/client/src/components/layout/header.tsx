import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { GraduationCap, Home, Shield, University } from "lucide-react";

export default function Header() {
  const [location] = useLocation();

  return (
    <header className="bg-card shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-4">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-semibold text-foreground">EduTest CBT Platform</h1>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button 
                variant={location === "/" ? "default" : "ghost"} 
                size="sm"
                data-testid="link-home"
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link href="/admin/login">
              <Button 
                variant={location.startsWith("/admin") ? "default" : "secondary"}
                size="sm"
                data-testid="link-admin"
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin Portal
              </Button>
            </Link>
            <Link href="/student/login">
              <Button 
                variant={location.startsWith("/student") ? "default" : "secondary"}
                size="sm"
                className="bg-secondary hover:bg-secondary/90"
                data-testid="link-student"
              >
                <University className="h-4 w-4 mr-2" />
                Student Portal
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
