"use client";

import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { Table, message, Pagination } from "antd";
import type { TableProps } from "antd";
import { api } from "@/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AccountType {
  name: string;
}

interface Account {
  id: number | string;
  key: string;
  name: string;
  value: string;
  notes?: string;
  type: AccountType;
}

interface ApiResponse {
  data: Account[];
  recordsFiltered: number;
}

const AccountsPage: NextPage = () => {
  const [data, setData] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);

  const columns: TableProps<Account>["columns"] = [
    { title: "Key", dataIndex: "key", key: "key" },
    { title: "Nama Akun", dataIndex: "name", key: "name" },
    { title: "Nilai", dataIndex: "value", key: "value" },
    { title: "Catatan", dataIndex: "notes", key: "notes" },
  ];

  const fetchData = async (
    currentPage: number,
    currentPageSize: number,
  ): Promise<void> => {
    setLoading(true);
    try {
      const res = await api.get("variables/data", {
        searchParams: {
          space_id: 1,
          draw: 1,
          start: (currentPage - 1) * currentPageSize,
          length: currentPageSize,
        },
      });

      const json: ApiResponse = await res.json();

      setData(json.data);
      setTotal(json.recordsFiltered);
    } catch (err) {
      console.error("Failed to fetch account data:", err);
      message.error("Gagal mengambil data akun");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page, pageSize);
  }, [page, pageSize]);

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Kode Akses</CardTitle>
        <CardDescription>Berikut adalah daftar kode akses ruang anda</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={data}
            rowKey={(record) => record.id} // pastikan ini tidak undefined
            loading={loading}
            pagination={false}
            onRow={(record) => {
              return {
                onClick: () => {
                  console.log("Row clicked:", record);
                  alert(`Row clicked: ${record.name}`);
                },
                style: { cursor: "pointer" }, // biar tahu bisa diklik
              };
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
    </Card>
  );
};

export default AccountsPage;
