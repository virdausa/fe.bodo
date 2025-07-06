import { Table } from "antd";
import type { TableProps } from "antd";
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

const columns: TableProps<Account>["columns"] = [
  { title: "Kode", dataIndex: "code", key: "code", width: 150 },
  { title: "Nama Akun", dataIndex: "name", key: "name", ellipsis: true },
  {
    title: "Tipe",
    dataIndex: ["type", "name"],
    key: "type.name",
    width: 200,
    ellipsis: true,
  },
  { title: "Notes", dataIndex: "notes", key: "notes", ellipsis: true },
  { title: "Saldo", dataIndex: "balance", key: "balance", width: 150, align: "right" },
];

// Define columns for the sub-table (children)
// These can be the same or a subset of the main columns
const childColumns: TableProps<Account>["columns"] = [
    { title: "Kode", dataIndex: "code", key: "code", width: 130 }, // Slightly less width for indentation
    { title: "Nama Akun", dataIndex: "name", key: "name", ellipsis: true },
    {
      title: "Tipe",
      dataIndex: ["type", "name"],
      key: "type.name",
      width: 180,
      ellipsis: true,
    },
    { title: "Notes", dataIndex: "notes", key: "notes", ellipsis: true },
    { title: "Saldo", dataIndex: "balance", key: "balance", width: 130, align: "right" },
  ];


export function AccountsTable({
  loading,
  data,
  selectedRowKeys,
  onRowClick,
  onSelectionChange,
  expandedRowKeys,
  onExpand,
}: AccountsTableProps) {
  const expandedRowRender = (record: Account) => {
    // Check if children exist and have data
    if (!record.children || record.children.length === 0) {
      // If has_children was true but children array is empty after loading,
      // it means no children were found.
      // If has_children was initially false, this part might not even be reached
      // depending on rowExpandable logic.
      return <p style={{ margin: 0, paddingLeft: "48px" }}>Tidak ada sub-akun.</p>;
    }

    return (
      <Table
        columns={childColumns}
        dataSource={record.children}
        rowKey="id"
        pagination={false}
        size="small"
        showHeader={false} // Optionally hide header for sub-table to make it cleaner
        onRow={(childRecord) => ({
          onClick: (event) => {
            event.stopPropagation(); // Prevent parent row's onRowClick
            onRowClick(childRecord); // Allow clicking on child rows
          },
          style: { cursor: "pointer" },
        })}
        // Child rows should not be selectable if selection is only for parent level,
        // or needs different handling. For simplicity, disabling selection on children here.
        // rowSelection={{}}
      />
    );
  };

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
        expandable={{
          expandedRowKeys: expandedRowKeys,
          onExpand: onExpand,
          rowExpandable: (record) =>
            record.has_children || (record.children && record.children.length > 0) || record.children_count > 0,
          expandedRowRender: expandedRowRender,
          // expandIcon: ({ expanded, onExpand, record }) => ... custom icon if needed
        }}
      />
    </div>
  );
}
