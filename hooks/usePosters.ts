import useSWR from "swr";
import { Poster } from "@/types/type";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch posters");
  const data = await res.json();
  return data.posters.slice(0, 5);
};

export const usePosters = () => {
  const { data, error, isLoading } = useSWR<Poster[]>("/api/poster", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  return {
    posters: data || [],
    loading: isLoading,
    error: error ? "خطا در بارگیری بنرها" : null,
  };
};
