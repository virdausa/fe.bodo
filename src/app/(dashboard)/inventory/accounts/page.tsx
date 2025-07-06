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
    // Second layer of defense: check again before actually deleting
    const accountsToDeleteDetails = selectedRowKeys.map(key => data.find(acc => acc.id === key)).filter(Boolean) as Account[];
    const hasParentWithChildren = accountsToDeleteDetails.some(account => account.has_children || (account.children_count && account.children_count > 0));

    if (hasParentWithChildren) {
      toast.error("Tidak dapat menghapus akun. Salah satu akun yang dipilih memiliki sub-akun.");
      setIsDeleteModalOpen(false); // Close the confirmation modal
      return;
    }

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
      const needsLoading = !record.children &&
                           (record.has_children === true || (typeof record.children_count === 'number' && record.children_count > 0));

      if (needsLoading) {
        setExpandedRowKeys((prevKeys) => [...prevKeys, record.id]);
        try {
          const accountDetails = await accountService.getAccountDetails(record.id);
          setData((currentData) =>
            currentData.map((acc) =>
              acc.id === record.id
                ? { ...acc, children: accountDetails.children || [] }
                : acc,
            ),
          );
        } catch (error) {
          toast.error(`Gagal memuat sub-akun untuk ${record.name}`);
          setData((currentData) =>
            currentData.map((acc) =>
              acc.id === record.id
                ? { ...acc, children: [] } // Set children to empty array on error
                : acc,
            ),
          );
          setExpandedRowKeys((prevKeys) => prevKeys.filter(key => key !== record.id));
        }
      } else if (record.children) {
        setExpandedRowKeys((prevKeys) => [...prevKeys, record.id]);
      } else if (record.has_children === false || (typeof record.children_count === 'number' && record.children_count === 0)) {
        // No children to load, ensure children is [], so "No sub-accounts" message is shown by renderer
        setData((currentData) =>
            currentData.map(acc => acc.id === record.id && !acc.children ? {...acc, children: []} : acc)
        );
        setExpandedRowKeys((prevKeys) => [...prevKeys, record.id]);
      }
    } else if (!expanded && record.id) {
      setExpandedRowKeys((prevKeys) => prevKeys.filter(key => key !== record.id));
    }
  };

  const handleExpandSubRow = async (
    expanded: boolean,
    _parentInTree: Account, // Not strictly needed for global search update by ID
    recordToExpand: Account,
  ) => {
    if (expanded && recordToExpand.id) {
      const needsLoading = !recordToExpand.children &&
                           (recordToExpand.has_children === true || (typeof recordToExpand.children_count === 'number' && recordToExpand.children_count > 0));

      if (needsLoading) {
        setExpandedRowKeys((prevKeys) => [...prevKeys, recordToExpand.id]);
        try {
          const details = await accountService.getAccountDetails(recordToExpand.id);

          setData((currentData) => {
            const updateRecursively = (nodes: Account[]): Account[] => {
              return nodes.map(node => {
                if (node.id === recordToExpand.id) {
                  return { ...node, children: details.children || [] };
                }
                if (node.children) {
                  const updatedNodeChildren = updateRecursively(node.children);
                  if (updatedNodeChildren !== node.children) {
                    return { ...node, children: updatedNodeChildren };
                  }
                }
                return node;
              });
            };
            return updateRecursively(currentData);
          });

        } catch (error) {
          toast.error(`Gagal memuat sub-akun untuk ${recordToExpand.name}`);
          setData(currentData => {
              const setErrorChildrenRecursively = (nodes: Account[]): Account[] => {
                return nodes.map(node => {
                  if (node.id === recordToExpand.id) {
                    return { ...node, children: [] };
                  }
                  if (node.children) {
                    const updatedNodeChildren = setErrorChildrenRecursively(node.children);
                    if (updatedNodeChildren !== node.children) {
                        return { ...node, children: updatedNodeChildren };
                    }
                  }
                  return node;
                });
              };
              return setErrorChildrenRecursively(currentData);
          });
          setExpandedRowKeys((prevKeys) => prevKeys.filter(key => key !== recordToExpand.id));
        }
      } else if (recordToExpand.children) {
        setExpandedRowKeys((prevKeys) => [...prevKeys, recordToExpand.id]);
      }
      else if (recordToExpand.has_children === false || (typeof recordToExpand.children_count === 'number' && recordToExpand.children_count === 0)) {
         setData((currentData) => {
            const setEmptyChildrenRecursively = (nodes: Account[]): Account[] => {
                return nodes.map(node => {
                  if (node.id === recordToExpand.id && !node.children) {
                    return { ...node, children: [] };
                  }
                  if (node.children) {
                    const updatedNodeChildren = setEmptyChildrenRecursively(node.children);
                    if (updatedNodeChildren !== node.children) {
                        return { ...node, children: updatedNodeChildren };
                    }
                  }
                  return node;
                });
              };
            return setEmptyChildrenRecursively(currentData);
         });
         setExpandedRowKeys((prevKeys) => [...prevKeys, recordToExpand.id]);
      }
    } else if (!expanded && recordToExpand.id) {
      setExpandedRowKeys((prevKeys) => prevKeys.filter(key => key !== recordToExpand.id));
    }
  };

  // const handleExpandGrandchild = async (
  //   expanded: boolean,
  //   parentOfChild: Account,
  //   childToExpand: Account,
  // ) => {
  //   // This logic is now removed or deferred as AntD default rendering for children is used.
  //   // If multi-level is needed beyond what AntD provides automatically, this needs to be revisited.
  //   if (expanded && childToExpand.id) {
  //     if (childToExpand.children && childToExpand.children.length > 0) {
  //       setExpandedRowKeys((prevKeys) => [...prevKeys, childToExpand.id]);
  //       return;
  //     }
  //     if (childToExpand.has_children === false || (typeof childToExpand.children_count === 'number' && childToExpand.children_count === 0)) {
  //       setExpandedRowKeys((prevKeys) => [...prevKeys, childToExpand.id]);
  //       setData(currentData => currentData.map(topLevelAccount => {
  //           if (topLevelAccount.id === parentOfChild.id && topLevelAccount.children) {
  //               return {
  //                   ...topLevelAccount,
  //                   children: topLevelAccount.children.map(child =>
  //                       child.id === childToExpand.id ? { ...child, children: [] } : child
  //                   ),
  //               };
  //           }
  //           return topLevelAccount;
  //       }));
  //       return;
  //     }

  //     setExpandedRowKeys((prevKeys) => [...prevKeys, childToExpand.id]);
  //     try {
  //       const grandchildDetails = await accountService.getAccountDetails(childToExpand.id);
  //       setData((currentData) =>
  //         currentData.map((topLevelAccount) => {
  //           if (topLevelAccount.id === parentOfChild.id && topLevelAccount.children) {
  //             return {
  //               ...topLevelAccount,
  //               children: topLevelAccount.children.map((childL1) =>
  //                 childL1.id === childToExpand.id
  //                   ? { ...childL1, children: grandchildDetails.children || [] }
  //                   : childL1,
  //               ),
  //             };
  //           }
  //           return topLevelAccount;
  //         }),
  //       );
  //     } catch (error) {
  //       toast.error(`Gagal memuat sub-akun untuk ${childToExpand.name}`);
  //       setExpandedRowKeys((prevKeys) => prevKeys.filter(key => key !== childToExpand.id));
  //     }
  //   } else if (!expanded && childToExpand.id) {
  //     setExpandedRowKeys((prevKeys) => prevKeys.filter(key => key !== childToExpand.id));
  //   }
  // };

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
        {selectedRowKeys.length > 0 && (
          <Button
            danger
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={selectedRowKeys.some(key => {
              const account = data.find(acc => acc.id === key);
              return account && (account.has_children || (account.children_count && account.children_count > 0));
            })}
          >
            Hapus Terpilih ({selectedRowKeys.length})
          </Button>
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
          onExpandSubRow={handleExpandSubRow}
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
