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


interface Space {
  id: number | string;
  code: string;
  name: string;
  notes?: string;
  address?: string;
  parent: Space;
  parent_type?: string;
  parent_id?: number | string;
}

interface ApiDataTable {
  data: Space[];
  recordsFiltered: number;
}

interface ApiResponse {
  data: unknown;
  success: boolean;
  toast: string;
}



const SpacesPage: NextPage = () => {
  const [data, setData] = useState<Space[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const [form] = Form.useForm();
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [parentSpaces, setParentSpaces] = useState<Space[]>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const columns: TableProps<Space>["columns"] = [
    { title: "Kode", dataIndex: "code", key: "code" },
    { title: "Parent", dataIndex: "parent.name", key: "parent.name" },
    { title: "Nama Lahan", dataIndex: "name", key: "name" },
    { title: "Lokasi", dataIndex: "address", key: "address" },
    { title: "Notes", dataIndex: "notes", key: "notes" },
  ];

  const fetchData = async (
    currentPage: number,
    currentPageSize: number,
  ): Promise<void> => {
    setLoading(true);
    try {
      const res = await api.get("spaces/data", {
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
      toast.error("Gagal mengambil data lahan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page, pageSize);
    // fetchDropdowns();
  }, [page, pageSize]);

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const handleSearchParent = async (value: string) => {
    if (!value) return;

    setSearchLoading(true);
    try {
      const res = await api.get("spaces/search", {
        searchParams: {
          space_id: 1,
          q: value,
        },
      });

      const json: ApiDataTable = await res.json();

      setParentSpaces(json.data || []);
    } catch (err) {
      console.error("Gagal ambil data dropdown:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  // modal
  const handleAddNewSpace = () => {
    form.resetFields();
    setSelectedSpace(null); // beda dengan edit
    setIsModalOpen(true);
    setParentSpaces([]); // kosongkan dulu
  };

  const handleRowClick = async (record: Space) => {
    setSelectedSpace(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);

    if (record.parent_id) {
      const res = await api.get(`spaces/${record.parent_id}`);
      const parent: ApiDataTable = await res.json();
      setParentSpaces(parent.data || []);

      console.log("parent:", parent);
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setSelectedSpace(null);
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
      if (selectedSpace) {
        res = await api.put(`spaces/${selectedSpace.id}`, {
          json: values,
        });
      } else {
        res = await api.post("spaces", {
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
        loading: "Sedang menyimpan lahan...",
        success: (result) => result.toast || "Berhasil menyimpan lahan",
      });
    } catch (err) {
      console.error("Gagal menyimpan lahan:", err);
      if (err instanceof Error) {
        toast.error(`Gagal menyimpan lahan: ${err.message}`);
      }
    }

    setIsModalOpen(false);
    setSelectedSpace(null);
  };

  // modal delete
  const handleDeleteMultiple = async () => {
    async function handler() {
      selectedRowKeys.map(
        async (id) => await api.delete(`spaces/${id}?request_source=api`),
      );
    }

    try {
      toast.promise(handler, {
        loading: "Sedang menghapus lahan terpilih...",
        success: "Akun terpilih berhasil dihapus",
      });
      setSelectedRowKeys([]);
      setIsDeleteModalOpen(false);
      fetchData(page, pageSize);
    } catch (err) {
      console.error("Gagal menghapus lahan:", err);
      if (err instanceof Error) {
        toast.error(`Gagal menghapus lahan: ${err.message}`);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Lahan</CardTitle>
        <CardDescription>Berikut adalah daftar lahan-lahan anda</CardDescription>
      </CardHeader>

      <Flex gap="small" wrap justify="end" style={{ margin: 16 }}>
        <Button type="primary" onClick={handleAddNewSpace}>
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
        title={selectedSpace ? "Edit Akun" : "Tambah Akun"}
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

          <Form.Item name="parent_id" label="Akun Induk" required={false}>
            <Select
              showSearch
              placeholder="Cari lahan induk"
              allowClear
              onSearch={handleSearchParent}
              filterOption={false}
              loading={searchLoading}
              notFoundContent={
                searchLoading ? <Spin size="small" /> : "Tidak ditemukan"
              }
            >
              {parentSpaces.map((acc) => (
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
          Apakah kamu yakin ingin menghapus {selectedRowKeys.length} lahan ini?
          Tindakan ini tidak bisa dibatalkan.
        </p>
      </Modal>
    </Card>
  );
};

export default SpacesPage;
