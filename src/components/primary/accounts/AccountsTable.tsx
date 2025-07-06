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
  Table.EXPAND_COLUMN, // Explicitly add the expand column
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

// childColumns might not be needed if we are manually rendering rows.
// However, we can use its structure to define the layout if desired.

export function AccountsTable({
  loading,
  data,
  selectedRowKeys,
  onRowClick,
  onSelectionChange,
  expandedRowKeys,
  onExpand,
}: AccountsTableProps) {
  const expandedRowRender = (parentRecord: Account) => {
    if (!parentRecord.children || parentRecord.children.length === 0) {
      return <div style={{ padding: "12px", paddingLeft: "48px", backgroundColor: "#fafafa" }}>Tidak ada sub-akun.</div>;
    }

    // Manual rendering of child rows
    // We'll try to mimic the main table's column widths approximately for alignment.
    // These widths correspond to the `columns` definition for the main table.
    // Kode: 150, Nama Akun: auto (ellipsis), Tipe: 200, Notes: auto (ellipsis), Saldo: 150
    // For children, we might want to indent them slightly.
    const cellPadding = "8px 12px"; // Consistent padding for cells
    const childRowStyle: React.CSSProperties = {
      display: "flex",
      borderBottom: "1px solid #f0f0f0",
      backgroundColor: "#fafafa", // Slight background for children area
      cursor: "pointer",
    };
    const cellStyle: React.CSSProperties = {
      padding: cellPadding,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    };

    return (
      <div style={{ margin: "0", paddingLeft: "48px" /* Indent for child section */ }}>
        {/* Optional: Render a simple header for children if needed */}
        {/* <div style={{ display: "flex", borderBottom: "1px solid #e8e8e8", fontWeight: "bold", backgroundColor: "#fafafa" }}>
          <div style={{ ...cellStyle, width: "130px" }}>Kode Anak</div>
          <div style={{ ...cellStyle, flexGrow: 1 }}>Nama Anak</div>
          <div style={{ ...cellStyle, width: "180px" }}>Tipe</div>
          <div style={{ ...cellStyle, flexGrow: 1 }}>Notes</div>
          <div style={{ ...cellStyle, width: "130px", textAlign: "right" }}>Saldo</div>
        </div> */}
        {parentRecord.children.map((childAccount) => (
          <div
            key={childAccount.id}
            style={childRowStyle}
            onClick={(event) => {
              event.stopPropagation();
              onRowClick(childAccount);
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f0f0f0"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#fafafa"}
          >
            <div style={{ ...cellStyle, width: columns[0].width as number - 20 || 130 /* Kode */ }}>{childAccount.code}</div>
            <div style={{ ...cellStyle, flexGrow: 1 /* Nama Akun */ }}>{childAccount.name}</div>
            <div style={{ ...cellStyle, width: columns[2].width as number -20 || 180 /* Tipe */ }}>{childAccount.type?.name}</div>
            <div style={{ ...cellStyle, flexGrow: 1 /* Notes */ }}>{childAccount.notes}</div>
            <div style={{ ...cellStyle, width: columns[4].width as number -20 || 130, textAlign: "right" /* Saldo */ }}>
              {/* Format balance if needed */}
              {childAccount.balance}
            </div>
          </div>
        ))}
      </div>
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
