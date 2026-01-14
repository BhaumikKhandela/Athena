import { PAGINATION } from "@/config/constants";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface useWorkflowSearchProps {
  search: string;
  page: number;
  debounceMs?: number;
}
export const useWorkflowSearch = ({
  search,
  page,
  debounceMs = 500,
}: useWorkflowSearchProps) => {
  const trpc = useTRPC();

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [search, debounceMs]);

  return useQuery(
    trpc.workflows.getMany.queryOptions({
      search: debouncedSearch,
      page: page,
      pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
    })
  );
};
