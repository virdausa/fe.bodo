"use client";

import { useEffect, useState, useCallback } from "react";
import type { NextPage } from "next";
import { Form, Button, Flex, Pagination, Modal, Input } from "antd";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAccountsData } from "@/hooks/use-account-data";
import { AccountsTable } from "@/components/primary/accounts/AccountsTable";
import { AccountFormModal } from "@/components/primary/accounts/AccountFormModal";
import { accountService } from "@/api/services/accounts.service";
import { Account, AccountType } from "@/types/account";

const AccountsPage: NextPage = () => {
  const {
    data,
    loading,
    total,
    page,
    pageSize,
    handlePaginationChange,
    refreshAccounts,
    search,
    setSearch,
    setData, // Destructure setData from useAccountsData
  } = useAccountsData();
  const [form] = Form.useForm();
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [accountTypes, setAccountTypes] = useState<AccountType[]>([]);
  const [parentAccounts, setParentAccounts] = useState<Account[]>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const fetchDropdowns = useCallback(async () => {
    try {
      const { data } = await accountService.getAccountTypes();
      setAccountTypes(data || []);
    } catch (err) {
      console.error("Gagal ambil data dropdown:", err);
      toast.error("Gagal memuat tipe akun.");
    }
  }, []);

  useEffect(() => {
    fetchDropdowns();
  }, [fetchDropdowns]);

  const handleSearchParent = useCallback(async (value: string) => {
    if (!value) return;
    setSearchLoading(true);
    try {
      const { data } = await accountService.searchParentAccounts(value);
      setParentAccounts(data || []);
    } catch (err) {
      console.error("Gagal mencari akun induk:", err);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const handleAddNewAccount = () => {
    form.resetFields();
    setSelectedAccount(null);
    setIsModalOpen(true);
    setParentAccounts([]);
  };

  const handleRowClick = async (record: Account) => {
    setSelectedAccount(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
    if (record.parent_id) {
      try {
        const { data } = await accountService.getAccountById(record.parent_id);
        setParentAccounts(data || []);
      } catch {
        toast.error("Gagal memuat akun induk.");
      }
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setSelectedAccount(null);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      await toast.promise(
        accountService.saveAccount(values, selectedAccount?.id || null),
        {
          loading: "Sedang menyimpan akun...",
          success: (result) => {
            refreshAccounts(); // This refetches top-level data
            setExpandedRowKeys([]); // Collapse all rows to ensure fresh data on re-expand
            setIsModalOpen(false);
            setSelectedAccount(null);
            return result.toast || "Berhasil menyimpan akun";
          },
          error: (err: Error) => `Gagal menyimpan akun: ${err.message}`,
        },
      );
    } catch (errorInfo) {
      // Validation failed
      console.log("Failed:", errorInfo);
    }
  };

  const handleDeleteMultiple = async () => {
    await toast.promise(accountService.deleteAccounts(selectedRowKeys), {
      loading: "Sedang menghapus akun terpilih...",
      success: () => {
        setSelectedRowKeys([]);
        setIsDeleteModalOpen(false);
         refreshAccounts(); // This refetches top-level data
         setExpandedRowKeys([]); // Collapse all rows
        return "Akun terpilih berhasil dihapus";
      },
      error: "Gagal menghapus akun.",
    });
  };

  const handleExpand = async (expanded: boolean, record: Account) => {
    if (expanded && record.id) {
      // Check if children are already loaded or if it's marked as having no children
      if (record.children && record.children.length > 0) {
        // Children already loaded
        setExpandedRowKeys((prevKeys) => [...prevKeys, record.id]);
        return;
      }
      if (record.has_children === false || record.children_count === 0) {
        // Explicitly marked as no children
        setExpandedRowKeys((prevKeys) => [...prevKeys, record.id]); // Expand to show "no children" message if table handles it
        return;
      }

      // Load children
      // Add to expandedRowKeys immediately to show loading indicator in table if configured
      setExpandedRowKeys((prevKeys) => [...prevKeys, record.id]);
      try {
        const accountDetails = await accountService.getAccountDetails(record.id);
        setData((currentData) =>
          currentData.map((acc) =>
            acc.id === record.id
              ? { ...acc, children: accountDetails.children || [] } // Ensure children is at least an empty array
              : acc,
          ),
        );
      } catch (error) {
        toast.error(`Gagal memuat detail akun untuk ${record.name}`);
        // Remove from expandedRowKeys if loading failed, so it can be tried again
        setExpandedRowKeys((prevKeys) => prevKeys.filter(key => key !== record.id));
      }
    } else if (!expanded && record.id) {
      setExpandedRowKeys((prevKeys) => prevKeys.filter(key => key !== record.id));
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Akun</CardTitle>
        <CardDescription>Berikut adalah daftar akun akun anda</CardDescription>
      </CardHeader>

      <Flex
        gap="small"
        wrap
        justify="space-between"
        style={{ margin: "8px 16px" }}
      >
        <Button type="primary" onClick={handleAddNewAccount}>
          + Tambah Akun
        </Button>

        <Input.Search
          placeholder="Cari akun..."
          allowClear  
          enterButton
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={(value) => {
            setSearch(value); // This will trigger useEffect in useAccountsData to refetch
            setExpandedRowKeys([]); // Collapse all rows on new search
            // Data will be refreshed by the hook, which now includes setData
          }}
          style={{ width: "300px" }}
        />
      </Flex>

      <Flex
        style={{ margin: "8px 16px" }}
      >
        {selectedRowKeys.length > 0 ? (
          <Button danger onClick={() => setIsDeleteModalOpen(true)}>
            Hapus Terpilih ({selectedRowKeys.length})
          </Button>
        ) : (
          <div />
        )}
      </Flex>

      <CardContent className="space-y-4">
        <AccountsTable
          loading={loading}
          data={data}
          selectedRowKeys={selectedRowKeys}
          onRowClick={handleRowClick}
          onSelectionChange={setSelectedRowKeys}
          expandedRowKeys={expandedRowKeys}
          onExpand={handleExpand}
        />
        <div className="flex justify-end">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={total}
            onChange={handlePaginationChange}
            showSizeChanger
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} of ${total} items`
            }
          />
        </div>
      </CardContent>

      <AccountFormModal
        isOpen={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        form={form}
        selectedAccount={selectedAccount}
        accountTypes={accountTypes}
        parentAccounts={parentAccounts}
        searchLoading={searchLoading}
        onSearchParent={handleSearchParent}
      />

      <Modal
        title="Konfirmasi Hapus"
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onOk={handleDeleteMultiple}
        okText="Ya, Hapus"
        cancelText="Batal"
      >
        <p>
          Apakah kamu yakin ingin menghapus {selectedRowKeys.length} akun ini?
          Tindakan ini tidak bisa dibatalkan.
        </p>
      </Modal>
    </Card>
  );
};

export default AccountsPage;
