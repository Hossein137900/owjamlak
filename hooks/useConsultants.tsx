import useSWR from "swr";

const fetcher = async (url: string) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return {
    consultants: data.consultants,
    total: data.total || 0,
    page: data.page || 1,
    limit: data.limit || data.consultants?.length || 0,
  };
};

const useConsultants = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/consultant",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30000,
    }
  );

  return {
    consultants: data?.consultants,
    total: data?.total || 0,
    isLoading,
    error,
    mutate,
  };
};

export default useConsultants;
