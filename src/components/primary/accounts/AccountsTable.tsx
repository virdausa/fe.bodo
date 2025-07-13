import { Table } from "antd";
import type { TableColumnsType } from "antd";
import { Account } from "@/types/account";

interface AccountsTableProps {
  loading: boolean;
  data: Account[];
  selectedRowKeys: React.Key[];
  onRowClick: (record: Account) => void;
  onSelectionChange: (selectedKeys: React.Key[]) => void;
  expandedRowKeys: React.Key[];
  onExpand: (expanded: boolean, record: Account) => void;
}

const columns: TableColumnsType<Account> = [
  { title: "ID", dataIndex: "id", key: "id" },
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
  expandedRowKeys,
  onExpand: handleExpand,
}: AccountsTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={false}
        expandable={{
          expandedRowKeys,
          onExpand: handleExpand,
          rowExpandable: (record) => {
            console.log("checking expandable for", record.id, record.has_children);
            return !!record.has_children;
          }
        }}
        onRow={(record) => ({
          onClick: () => onRowClick(record),
          style: { cursor: "pointer" },
        })}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectionChange,
          getCheckboxProps: (record: Account) => ({
            disabled: false,  
          }),
        }}
      />
    </div>
  );
}
