"use client";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { FiShield } from "react-icons/fi";

interface BlogAuthGuardProps {
  children: React.ReactNode;
}

export default function BlogAuthGuard({ children }: BlogAuthGuardProps) {
  const { user, hasAccess } = useAdminAuth();

  if (!user || !hasAccess(["admin", "superadmin"])) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <FiShield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            دسترسی محدود
          </h2>
          <p className="text-gray-600">
            فقط ادمین‌ها و سوپرادمین‌ها به این صفحه دسترسی دارند
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
