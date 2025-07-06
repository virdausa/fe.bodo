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

  // fetchData remains largely the same, but relies on the backend
  // to provide `has_children` or `children_count` for each account
  // in the main listing.
  const fetchData = useCallback(
    async (currentPage: number, currentPageSize: number, keyword: string) => {
      setLoading(true);
      try {
        const res = await api.get("accounts/data", {
          searchParams: {
            draw: 1, // Note: 'draw' is often for DataTables, ensure backend handles it or remove if not needed
            start: (currentPage - 1) * currentPageSize,
            length: currentPageSize,
            q: keyword,
            parent_only: true, // Always fetch only parent accounts for the main table
            // We are assuming the backend now includes has_children or children_count
            // in the response for each account within `json.data`.
          },
        });

        const json: ApiDataTable = await res.json();
        // Ensure that the data transformation to tree structure happens in the Page/Component
        // This hook will provide the paginated, flat list as received from the API.
        // If accounts have children, they will be loaded on demand by the component.
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

  // Function to update a single account in the data list,
  // useful for when children are loaded and need to be merged.
  const updateAccountInData = (updatedAccount: Account) => {
    setData((currentData) =>
      currentData.map((account) =>
        account.id === updatedAccount.id ? updatedAccount : account,
      ),
    );
  };

  return {
    data,
    // Expose setData for direct manipulation if needed by the page for complex state updates like adding children
    // Alternatively, provide a specific function like 'updateAccountWithChildren'
    setData, // Added setData to be used by AccountsPage to update children
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
