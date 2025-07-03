import { Table } from "antd";
import type { TableProps } from "antd";
import { Account } from "@/types/account";

interface AccountsTableProps {
  loading: boolean;
  data: Account[];
  selectedRowKeys: React.Key[];
  onRowClick: (record: Account) => void;
  onSelectionChange: (selectedKeys: React.Key[]) => void;
}

const columns: TableProps<Account>["columns"] = [
  { title: "Kode", dataIndex: "code", key: "code" },
  { title: "Nama Akun", dataIndex: "name", key: "name" },
  {
    title: "Tipe",
    dataIndex: ["type", "name"],
    key: "type.name",
  },
  { title: "Notes", dataIndex: "notes", key: "notes" },
  { title: "Saldo", dataIndex: "balance", key: "balance" },
];

export function AccountsTable({
  loading,
  data,
  selectedRowKeys,
  onRowClick,
  onSelectionChange,
}: AccountsTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={false}
        onRow={(record) => ({
          onClick: () => onRowClick(record),
          style: { cursor: "pointer" },
        })}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectionChange,
        }}
      />
    </div>
  );
}
