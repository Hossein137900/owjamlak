import { useState, useEffect } from "react";

interface DashboardStats {
  propertyListings: number;
  realEstateRequests: number;
  legalRequests: number;
  employmentRequests: number;
  users: number;
  newsletterSubscribers: number;
}

interface UseDashboardStatsReturn {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useDashboardStats = (): UseDashboardStatsReturn => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("/api/dashboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch dashboard stats");
      }

      if (data.success) {
        setStats(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch dashboard stats");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Dashboard fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const refetch = () => {
    fetchDashboardStats();
  };

  return {
    stats,
    isLoading,
    error,
    refetch,
  };
};
