// hooks/useDashboardStats.tsx
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface UserInfo {
  name: string;
  role: string;
  phone: string;
}
// hooks/useDashboardStats.tsx - Updated interface
interface DashboardData {
  userInfo: {
    name: string;
    role: string;
    phone: string;
    createdAt?: string;
  };
  // برای کاربران عادی و مشاوران
  myPosters?: number;
  myFavorites?: number;
  // برای ادمین و سوپر ادمین
  propertyListings?: number;
  realEstateRequests?: number;
  legalRequests?: number;
  employmentRequests?: number;
  users?: number;
  newsletterSubscribers?: number;
}

interface UseDashboardStatsReturn {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useDashboardStats = (): UseDashboardStatsReturn => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/auth");
      return;
    }

    try {
      const response = await fetch("/api/dashboard", {
        headers: { token },
      });

      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.message);
        if (response.status === 401) {
          localStorage.removeItem("token");
          router.push("/auth");
        }
      }
    } catch (err) {
      setError("خطا در دریافت اطلاعات");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [router]);

  const refetch = () => {
    setIsLoading(true);
    fetchDashboardData();
  };

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};
