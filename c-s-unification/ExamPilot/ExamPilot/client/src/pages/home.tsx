import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Shield, 
  GraduationCap, 
  Database, 
  ShieldCheck, 
  BarChart3, 
  CheckCircle 
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 px-2 animate-fade-up">
            Professional CBT Testing Platform
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8 px-4 animate-fade-up animate-delay-200 opacity-0">
            Comprehensive Computer-Based Testing solution for educational institutions. 
            Separate admin and student portals with advanced question management and real-time analytics.
          </p>
          
          {/* Portal Cards */}
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mt-8 sm:mt-10 lg:mt-12">
            {/* Admin Portal Card */}
            <Card className="overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-500 animate-slide-in-left animate-delay-400 opacity-0">
              <div className="admin-gradient h-24 sm:h-32 flex items-center justify-center relative overflow-hidden group">
                <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-white transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300"></div>
              </div>
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-3 sm:mb-4">
                  Administrator Portal
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                  Full control over questions, courses, student management, and detailed analytics.
                </p>
                <ul className="text-left text-sm text-muted-foreground space-y-2 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Question & Answer Management
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Course Categorization
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Student Performance Analytics
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Data Export & Reporting
                  </li>
                </ul>
                <Link href="/admin/login">
                  <Button className="w-full" data-testid="button-access-admin">
                    Access Admin Portal
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Student Portal Card */}
            <Card className="overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-500 animate-slide-in-right animate-delay-400 opacity-0">
              <div className="student-gradient h-24 sm:h-32 flex items-center justify-center relative overflow-hidden group">
                <GraduationCap className="h-10 w-10 sm:h-12 sm:w-12 text-white transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300"></div>
              </div>
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-3 sm:mb-4">
                  Student Portal
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                  Take tests, view results, and track your academic progress across different courses.
                </p>
                <ul className="text-left text-sm text-muted-foreground space-y-2 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                    Course-Based Testing
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                    Real-time Score Calculation
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                    Performance History
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                    Detailed Result Analysis
                  </li>
                </ul>
                <Link href="/student/login">
                  <Button 
                    className="w-full bg-secondary hover:bg-secondary/90"
                    data-testid="button-access-student"
                  >
                    Access Student Portal
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 sm:mt-16 lg:mt-20">
          <h3 className="text-xl sm:text-2xl font-semibold text-center text-foreground mb-8 sm:mb-10 lg:mb-12 px-4 animate-fade-up animate-delay-600 opacity-0">
            Platform Features
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center px-4 animate-scale-in animate-delay-800 opacity-0 group">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                <Database className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h4 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                PostgreSQL Integration
              </h4>
              <p className="text-sm sm:text-base text-muted-foreground">
                Robust database system for storing questions, answers, and student results.
              </p>
            </div>
            <div className="text-center px-4 animate-scale-in animate-delay-1000 opacity-0 group">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 transition-all duration-300 group-hover:bg-secondary/20 group-hover:scale-110">
                <ShieldCheck className="h-7 w-7 sm:h-8 sm:w-8 text-secondary" />
              </div>
              <h4 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                Secure Authentication
              </h4>
              <p className="text-sm sm:text-base text-muted-foreground">
                Separate authentication systems for admins and students with session management.
              </p>
            </div>
            <div className="text-center px-4 animate-scale-in animate-delay-1200 opacity-0 group">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 transition-all duration-300 group-hover:bg-accent/20 group-hover:scale-110">
                <BarChart3 className="h-7 w-7 sm:h-8 sm:w-8 text-accent" />
              </div>
              <h4 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                Advanced Analytics
              </h4>
              <p className="text-sm sm:text-base text-muted-foreground">
                Comprehensive reporting and analytics for student performance tracking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
