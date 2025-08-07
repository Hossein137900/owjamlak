// context/AdminAuthContext.tsx

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface User {
  id: string;
  name: string;
  role: "admin" | "user" | "superadmin" | "consultant";
}

interface AdminAuthContextType {
  user: User | null;
  isLoading: boolean;
  hasAccess: (roles: string[]) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined
);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context)
    throw new Error("useAdminAuth باید فقط داخل AdminAuthProvider استفاده شود");
  return context;
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          localStorage.setItem('adminRedirect', 'true');
          toast.error("ابتدا وارد حساب کاربری خود شوید");
          router.push("/auth");
          return;
        }

        const res = await fetch("/api/auth/admin-check", {
          method: "GET",
          headers: {
            token,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          localStorage.removeItem("token");
          localStorage.setItem('adminRedirect', 'true');
          toast.error("دسترسی غیرمجاز! لطفاً دوباره وارد شوید");
          router.push("/auth");
          return;
        }

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.setItem('adminRedirect', 'true');
        toast.error("خطا در بررسی دسترسی! لطفاً دوباره تلاش کنید");
        router.push("/auth");
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [router]);

  const hasAccess = (roles: string[]) => {
    return user ? roles.includes(user.role) : false;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("با موفقیت خارج شدید");
    router.push("/auth");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <AdminAuthContext.Provider value={{ user, isLoading, hasAccess, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
