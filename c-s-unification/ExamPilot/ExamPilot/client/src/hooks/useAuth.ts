import { useQuery } from "@tanstack/react-query";

interface AdminUser {
  id: string;
  adminId: string;
  firstName: string;
  lastName: string;
}

interface StudentUser {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
}

export function useAdminAuth() {
  const { data: admin, isLoading } = useQuery<AdminUser>({
    queryKey: ["/api/admin/me"],
    retry: false,
  });

  return {
    admin,
    isLoading,
    isAuthenticated: !!admin,
  };
}

export function useStudentAuth() {
  const { data: student, isLoading } = useQuery<StudentUser>({
    queryKey: ["/api/student/me"],
    retry: false,
  });

  return {
    student,
    isLoading,
    isAuthenticated: !!student,
  };
}
