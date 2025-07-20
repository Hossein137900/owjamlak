import { Poster } from "@/types/type";
import useSWR from "swr";

// Define the Poster interface

// API response interface
interface PostersResponse {
  posters: Poster[];
  total: number;
  page: number;
  limit: number;
}

// Fetcher function
const fetcher = async (url: string): Promise<PostersResponse> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Hook for fetching all posters
export const usePosters = (params?: {
  page?: number;
  limit?: number;
  type?: string;
  category?: string;
  propertyType?: string;
  status?: string;
  search?: string;
}) => {
  // Build query string
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.type && params.type !== "all")
    queryParams.append("type", params.type);
  if (params?.category && params.category !== "all")
    queryParams.append("category", params.category);
  if (params?.status && params.status !== "all")
    queryParams.append("status", params.status);
  if (params?.propertyType && params.propertyType !== "all")
    queryParams.append("propertyType", params.propertyType);
  if (params?.search) queryParams.append("search", params.search);

  const queryString = queryParams.toString();
  const url = `/api/poster${queryString ? `?${queryString}` : ""}`;

  const { data, error, isLoading, mutate } = useSWR<PostersResponse>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
    }
  );

  return {
    posters: data?.posters || [],
    total: data?.total || 0,
    page: data?.page || 1,
    limit: data?.limit || 10,
    isLoading,
    error,
    mutate,
  };
};

// Hook for fetching a single poster
export const usePoster = (id: string) => {
  const { data, error, isLoading, mutate } = useSWR<Poster>(
    id ? `/api/poster/${id}` : null,
    (url: string) =>
      fetch(url).then((res) => {
        if (!res.ok) throw new Error("Failed to fetch poster");
        return res.json();
      }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    poster: data,
    isLoading,
    error,
    mutate,
  };
};
// Hook for poster mutations (create, update, delete)
export const usePosterMutations = () => {


  const createPoster = async (posterData: Partial<Poster>): Promise<Poster> => {
    const response = await fetch("/api/poster", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(posterData),
    });

    if (!response.ok) {
      throw new Error("Failed to create poster");
    }

    return response.json();
  };

  // const updatePoster = async (
  //   // id: string,
  //   posterData: Partial<Poster>
  // ): Promise<Poster> => {
  //   const response = await fetch(`/api/poster`, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(posterData),
  //   });

  //   if (!response.ok) {
  //     throw new Error("Failed to update poster");
  //   }

  //   return response.json();
  // };

  const deletePoster = async (id: string): Promise<void> => {
    const response = await fetch(`/api/poster`, {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete poster");
    }
  };

  return {
    createPoster,
    // updatePoster,
    deletePoster,
  };
};
