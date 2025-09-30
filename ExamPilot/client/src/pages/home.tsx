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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Professional CBT Testing Platform
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Comprehensive Computer-Based Testing solution for educational institutions. 
            Separate admin and student portals with advanced question management and real-time analytics.
          </p>
          
          {/* Portal Cards */}
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            {/* Admin Portal Card */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="admin-gradient h-32 flex items-center justify-center">
                <Shield className="h-12 w-12 text-white" />
              </div>
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  Administrator Portal
                </h3>
                <p className="text-muted-foreground mb-6">
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
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="student-gradient h-32 flex items-center justify-center">
                <GraduationCap className="h-12 w-12 text-white" />
              </div>
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  Student Portal
                </h3>
                <p className="text-muted-foreground mb-6">
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
        <div className="mt-20">
          <h3 className="text-2xl font-semibold text-center text-foreground mb-12">
            Platform Features
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">
                PostgreSQL Integration
              </h4>
              <p className="text-muted-foreground">
                Robust database system for storing questions, answers, and student results.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="h-8 w-8 text-secondary" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">
                Secure Authentication
              </h4>
              <p className="text-muted-foreground">
                Separate authentication systems for admins and students with session management.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-chart-1/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-chart-1" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">
                Advanced Analytics
              </h4>
              <p className="text-muted-foreground">
                Comprehensive reporting and analytics for student performance tracking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
