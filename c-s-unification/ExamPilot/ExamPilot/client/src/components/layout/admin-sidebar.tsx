import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  BookOpen, 
  HelpCircle, 
  LayoutDashboard, 
  Users 
} from "lucide-react";
import { Link, useLocation } from "wouter";

const sidebarItems = [
  {
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    href: "/admin/questions",
    icon: HelpCircle,
    label: "Question Management",
  },
  {
    href: "/admin/courses",
    icon: BookOpen,
    label: "Course Management",
  },
  {
    href: "/admin/students",
    icon: Users,
    label: "Student Results",
  },
  {
    href: "/admin/analytics",
    icon: BarChart3,
    label: "Analytics",
  },
];

export default function AdminSidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-card shadow-sm border-r border-border">
      <nav className="p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <li key={item.href}>
                <Link href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isActive && "bg-accent"
                    )}
                    data-testid={`link-${item.label.toLowerCase().replace(" ", "-")}`}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Button>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
