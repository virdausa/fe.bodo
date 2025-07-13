import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { api } from "@/api";
import { Account, ApiDataTable } from "@/types/account";

export function useAccountsData() {
  const [data, setData] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [search, setSearch] = useState<string>("");

  const fetchData = useCallback(
    async (currentPage: number, currentPageSize: number, keyword: string) => {
      setLoading(true);
      try {
        const res = await api.get("accounts/data", {
          searchParams: {
            draw: 1,
            start: (currentPage - 1) * currentPageSize,
            length: currentPageSize,
            q: keyword,
            limit: 'all',
            parent_only: 'true',
          },
        });

        const json: ApiDataTable = await res.json();
        setData(json.data);
        setTotal(json.recordsFiltered);
      } catch (err) {
        console.error("Failed to fetch account data:", err);
        toast.error("Gagal mengambil data akun");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchData(page, pageSize, search);
  }, [page, pageSize, fetchData, search]);

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const refreshAccounts = () => fetchData(page, pageSize, search);

  return {
    data,
    loading,
    total,
    page,
    pageSize,
    handlePaginationChange,
    refreshAccounts,
    search,
    setSearch,
  };
}
