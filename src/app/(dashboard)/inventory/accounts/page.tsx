"use client";

import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { Table, Pagination } from "antd";
import { toast } from "sonner";
import type { TableProps } from "antd";
import { Modal, Form, Input, Button, Select, Spin, Flex } from "antd";
import { api } from "@/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AccountType {
  id: number | string;
  name: string;
}

interface Account {
  id: number | string;
  code: string;
  name: string;
  notes?: string;
  type_id: number | string;
  type: AccountType;
  parent_id?: number | string;
}

interface ApiDataTable {
  data: Account[];
  recordsFiltered: number;
}

interface ApiResponse {
  data: unknown;
  success: boolean;
  toast: string;
}

interface ApiResponseError {
  data: unknown;
  success: boolean;
  message: string;
}

interface ApiResponseType {
  data: AccountType[];
}

const AccountsPage: NextPage = () => {
  const [data, setData] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const [form] = Form.useForm();
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [accountTypes, setAccountTypes] = useState<AccountType[]>([]);
  const [parentAccounts, setParentAccounts] = useState<Account[]>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const columns: TableProps<Account>["columns"] = [
    { title: "Kode", dataIndex: "code", key: "code" },
    { title: "Nama Akun", dataIndex: "name", key: "name" },
    {
      title: "Tipe",
      dataIndex: ["type", "name"],
      key: "type.name",
    },
    { title: "Notes", dataIndex: "notes", key: "notes" },
  ];

  const fetchData = async (
    currentPage: number,
    currentPageSize: number,
  ): Promise<void> => {
    setLoading(true);
    try {
      const res = await api.get("accounts/data", {
        searchParams: {
          draw: 1,
          start: (currentPage - 1) * currentPageSize,
          length: currentPageSize,
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
  };

  useEffect(() => {
    fetchData(page, pageSize);
    fetchDropdowns();
  }, [page, pageSize]);

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const fetchDropdowns = async () => {
    try {
      const typesRes = await api.get("accounts/types/data");

      const typesJson: ApiResponseType = await typesRes.json();

      console.log("typesJson:", typesJson);

      setAccountTypes(typesJson.data || []);
    } catch (err) {
      console.error("Gagal ambil data dropdown:", err);
    }
  };

  const handleSearchParent = async (value: string) => {
    if (!value) return;

    setSearchLoading(true);
    try {
      const res = await api.get("accounts/search", {
        searchParams: {
          space_id: 1,
          q: value,
        },
      });

      const json: ApiDataTable = await res.json();

      setParentAccounts(json.data || []);
    } catch (err) {
      console.error("Gagal ambil data dropdown:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  // modal
  const handleAddNewAccount = () => {
    form.resetFields();
    setSelectedAccount(null); // beda dengan edit
    setIsModalOpen(true);
    setParentAccounts([]); // kosongkan dulu
  };

  const handleRowClick = async (record: Account) => {
    setSelectedAccount(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);

    if (record.parent_id) {
      const res = await api.get(`accounts/${record.parent_id}`);
      const parent: ApiDataTable = await res.json();
      setParentAccounts(parent.data || []);

      console.log("parent:", parent);
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setSelectedAccount(null);
  };

  const handleModalOk = async () => {
    const values = await form.validateFields();

    if (!values.parent_id) {
      values.parent_id = null;
    }

    // TODO: kirim data ke API pake api.put/post di sini
    async function handler() {
      console.log("values:", values);
      values.space_id = 1;

      let res;
      if (selectedAccount) {
        res = await api.put(`accounts/${selectedAccount.id}`, {
          json: values,
        });
      } else {
        res = await api.post("accounts", {
          json: values,
        });
      }
      const result: ApiResponse = await res.json();

      console.log("result:", result);
      if (!result.success) {
        throw new Error(result.toast);
      }

      fetchData(page, pageSize);

      return result;
    }

    try {
      toast.promise(handler, {
        loading: "Sedang menyimpan akun...",
        success: (result) => result.toast || "Berhasil menyimpan akun",
      });
    } catch (err) {
      console.error("Gagal menyimpan akun:", err);
      if (err instanceof Error) {
        toast.error(`Gagal menyimpan akun: ${err.message}`);
      }
    }

    setIsModalOpen(false);
    setSelectedAccount(null);
  };

  // modal delete
  const handleDeleteMultiple = async () => {
    async function handler() {
      selectedRowKeys.map(
        async (id) => await api.delete(`accounts/${id}?request_source=api`),
      );
    }

    try {
      toast.promise(handler, {
        loading: "Sedang menghapus akun terpilih...",
        success: "Akun terpilih berhasil dihapus",
      });
      setSelectedRowKeys([]);
      setIsDeleteModalOpen(false);
      fetchData(page, pageSize);
    } catch (err) {
      console.error("Gagal menghapus akun:", err);
      if (err instanceof Error) {
        toast.error(`Gagal menghapus akun: ${err.message}`);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Akun</CardTitle>
        <CardDescription>Berikut adalah daftar akun akun anda</CardDescription>
      </CardHeader>

      <Flex gap="small" wrap justify="end" style={{ margin: 16 }}>
        <Button type="primary" onClick={handleAddNewAccount}>
          + Tambah Akun
        </Button>
      </Flex>

      <Flex gap="small" wrap justify="left" style={{ margin: 8 }}>
        {selectedRowKeys.length > 0 && (
          <Button
            danger
            onClick={() => setIsDeleteModalOpen(true)}
            style={{ marginLeft: 16 }}
          >
            {" "}
            Hapus Terpilih ({selectedRowKeys.length})
          </Button>
        )}
      </Flex>

      <CardContent className="space-y-4">
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            loading={loading}
            pagination={false}
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
              style: { cursor: "pointer" },
            })}
            rowSelection={{
              selectedRowKeys,
              onChange: (selectedKeys) => setSelectedRowKeys(selectedKeys),
            }}
          />
        </div>

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

      <Modal
        title={selectedAccount ? "Edit Akun" : "Tambah Akun"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Simpan"
        cancelText="Batal"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Nama Akun" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="code" label="Kode Akun" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="type_id"
            label="Tipe Akun"
            rules={[{ required: true }]}
          >
            <Select placeholder="Pilih tipe akun">
              {accountTypes.map((type) => (
                <Select.Option key={type.id} value={type.id}>
                  {type.id}: {type.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="parent_id" label="Akun Induk" required={false}>
            <Select
              showSearch
              placeholder="Cari akun induk"
              allowClear
              onSearch={handleSearchParent}
              filterOption={false}
              loading={searchLoading}
              notFoundContent={
                searchLoading ? <Spin size="small" /> : "Tidak ditemukan"
              }
            >
              {parentAccounts.map((acc) => (
                <Select.Option key={acc.id} value={acc.id}>
                  {acc.code} - {acc.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="notes" label="Catatan">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Delete */}
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
