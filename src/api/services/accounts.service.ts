// src/api/services/account.service.ts
import { api } from "..";
import {
  Account,
  AccountType,
  ApiDataTable,
  ApiResponse,
} from "@/types/account";

/**
 * Fetches a paginated list of accounts.
 */
async function getAccounts(
  currentPage: number,
  currentPageSize: number,
): Promise<ApiDataTable> {
  const response = await api.get("accounts/data", {
    searchParams: {
      draw: 1,
      start: (currentPage - 1) * currentPageSize,
      length: currentPageSize,
    },
  });
  return response.json<ApiDataTable>();
}

/**
 * Fetches all available account types for dropdowns.
 */
async function getAccountTypes(): Promise<{ data: AccountType[] }> {
  const response = await api.get("accounts/types/data");
  return response.json<{ data: AccountType[] }>();
}

/**
 * Searches for parent accounts based on a query string.
 */
async function searchParentAccounts(query: string): Promise<ApiDataTable> {
  const response = await api.get("accounts/search", {
    searchParams: {
      space_id: 1, // Assuming space_id is static for now
      q: query,
    },
  });
  return response.json<ApiDataTable>();
}

/**
 * Fetches a single account by its ID, typically for populating the parent account field
 * or getting details including children.
 */
async function getAccountById(
  id: number | string,
): Promise<{ data: Account[] }> { // Backend returns { data: [account] }
  const response = await api.get(`accounts/${id}`);
  return response.json<{ data: Account[] }>();
}

/**
 * Fetches the full details of a single account, primarily for lazy loading children.
 * The backend's show($id) method returns { data: [accountWithChildren] }.
 */
async function getAccountDetails(
  accountId: number | string,
): Promise<Account> {
  const response = await api.get(`accounts/${accountId}`);
  // Assuming the backend returns { data: [account] } as per the show($id) method
  const result = await response.json<{ data: Account[] }>();
  if (result.data && result.data.length > 0) {
    return result.data[0]; // Return the first account object which should include its children
  }
  throw new Error("Account not found or invalid response structure");
}

/**
 * Creates a new account or updates an existing one.
 */
async function saveAccount(
  accountData: Partial<Account>,
  accountId: number | string | null,
): Promise<ApiResponse> {
  const payload: Partial<Account> & { space_id?: number } = { ...accountData, space_id: 1 }; // Assuming space_id is always 1 for now

  // Handle parent_id: if it's falsy (e.g., null, undefined, 0, ''), set it to null for the backend.
  // If it has a value, ensure it's a number.
  if (!payload.parent_id || String(payload.parent_id).trim() === "") {
    payload.parent_id = null;
  } else {
    const numParentId = Number(payload.parent_id);
    if (!isNaN(numParentId)) {
      payload.parent_id = numParentId;
    } else {
      // Handle error: parent_id is not a valid number
      // This case should ideally be caught by form validation earlier
      console.error("Invalid parent_id:", payload.parent_id);
      // Decide on behavior: throw error, or send null, or remove parent_id
      payload.parent_id = null; // Or delete payload.parent_id;
    }
  }

  const response = accountId
    ? await api.put(`accounts/${accountId}`, { json: payload })
    : await api.post("accounts", { json: payload });

  const result: ApiResponse = await response.json();
  if (!result.success) {
    throw new Error(result.toast || "An unknown error occurred");
  }
  return result;
}

/**
 * Deletes multiple accounts based on their IDs.
 */
async function deleteAccounts(accountIds: React.Key[]): Promise<void> {
  const deletePromises = accountIds.map((id) =>
    api.delete(`accounts/${id}?request_source=api`),
  );
  await Promise.all(deletePromises);
}

export const accountService = {
  getAccounts,
  getAccountTypes,
  searchParentAccounts,
  getAccountById,
  getAccountDetails,
  saveAccount,
  deleteAccounts,
};
