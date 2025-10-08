import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { GraduationCap, Home, Shield, University, Menu, X } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export default function Header() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-card shadow-sm border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2 sm:space-x-4 group">
            <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
            <h1 className="text-sm sm:text-xl font-semibold text-foreground truncate transition-colors duration-300 group-hover:text-primary">
              C-S Unification EduTest Platform
            </h1>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <Link href="/">
              <Button 
                variant={location === "/" ? "default" : "ghost"} 
                size="sm"
                data-testid="link-home"
                className="transition-all duration-300 hover:scale-105"
              >
                <Home className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:scale-110" />
                Home
              </Button>
            </Link>
            <Link href="/admin/login">
              <Button 
                variant={location.startsWith("/admin") ? "default" : "secondary"}
                size="sm"
                data-testid="link-admin"
                className="transition-all duration-300 hover:scale-105"
              >
                <Shield className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:scale-110" />
                Admin Portal
              </Button>
            </Link>
            <Link href="/student/login">
              <Button 
                variant={location.startsWith("/student") ? "default" : "secondary"}
                size="sm"
                className="bg-secondary hover:bg-secondary/90 transition-all duration-300 hover:scale-105"
                data-testid="link-student"
              >
                <University className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:scale-110" />
                Student Portal
              </Button>
            </Link>
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetHeader className="flex flex-row items-center justify-between">
                <SheetTitle>Navigation</SheetTitle>
                <SheetClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </SheetClose>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-6">
                <Link href="/" onClick={() => setIsOpen(false)}>
                  <Button 
                    variant={location === "/" ? "default" : "ghost"} 
                    className="w-full justify-start"
                    data-testid="link-home-mobile"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Home
                  </Button>
                </Link>
                <Link href="/admin/login" onClick={() => setIsOpen(false)}>
                  <Button 
                    variant={location.startsWith("/admin") ? "default" : "secondary"}
                    className="w-full justify-start"
                    data-testid="link-admin-mobile"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Admin Portal
                  </Button>
                </Link>
                <Link href="/student/login" onClick={() => setIsOpen(false)}>
                  <Button 
                    variant={location.startsWith("/student") ? "default" : "secondary"}
                    className="w-full justify-start bg-secondary hover:bg-secondary/90"
                    data-testid="link-student-mobile"
                  >
                    <University className="h-4 w-4 mr-2" />
                    Student Portal
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
