import { Table } from "antd";
import type { TableProps } from "antd";
import { Account } from "@/types/account";

interface AccountsTableProps {
  loading: boolean;
  data: Account[];
  selectedRowKeys: React.Key[];
  onRowClick: (record: Account) => void;
  onSelectionChange: (selectedKeys: React.Key[]) => void;
  expandedRowKeys: React.Key[]; // Will store IDs of all expanded rows across all levels
  onExpand: (expanded: boolean, record: Account) => void; // For expanding top-level rows (Table's direct children)
  onExpandSubRow: (expanded: boolean, parentAccount: Account, subAccountToExpand: Account) => void; // For expanding rows rendered manually (children, grandchildren, etc.)
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
  onExpandSubRow, // Destructure the new prop
}: AccountsTableProps) {

  const денегНет = typeof स्तंभों[1].width === 'number' ? स्तंभों[1].width : 150; // Kode
  const nameWidth = null; // flexGrow
  const typeWidth = typeof columns[3].width === 'number' ? columns[3].width : 200; // Tipe
  const notesWidth = null; // flexGrow
  const balanceWidth = typeof columns[5].width === 'number' ? columns[5].width : 150; // Saldo
  const expandIconCellWidth = 40; // Width for the cell containing the expand icon for sub-rows
  const baseIndent = 20; // Base indent for each level, applied to the row container

  const renderAccountRow = (account: Account, level: number, parentOfThisAccount: Account | null) => {
    const isExpanded = expandedRowKeys.includes(account.id);
    const canExpand = Boolean(account.has_children) || (typeof account.children_count === 'number' && account.children_count > 0);

    const rowStyle: React.CSSProperties = {
      display: "flex",
      borderBottom: "1px solid #f0f0f0",
      backgroundColor: level % 2 === 0 ? "#fafafa" : "#ffffff", // Alternate bg for levels
      minHeight: "45px", // Approximate AntD row height
      alignItems: "center",
    };

    const cellStyle: React.CSSProperties = {
      padding: "10px 8px", // Adjusted padding
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      boxSizing: "border-box",
      lineHeight: "1.5715", // AntD default line height
      fontSize: "13px", // Slightly smaller font for sub-rows
    };

    const currentTotalRowIndent = baseIndent * level; // Total indent for the row content itself

    return (
      <React.Fragment key={account.id}>
        <div
          style={{...rowStyle, paddingLeft: `${currentTotalRowIndent}px`}} // Row starts with its level's indent
          onClick={(e) => { e.stopPropagation(); onRowClick(account);}}
          className="manual-account-row hover:bg-blue-50" // Example Tailwind hover
        >
          {/* Expand Icon Cell for sub-rows */}
          <div style={{ ...cellStyle, width: `${expandIconCellWidth}px`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '0', paddingRight: '0' }}>
            {canExpand && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (parentOfThisAccount) {
                     onExpandSubRow(!isExpanded, parentOfThisAccount, account);
                  }
                }}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '0', fontSize: '12px', color: '#555' }}
                aria-expanded={isExpanded}
                aria-label={isExpanded ? "Collapse row" : "Expand row"}
              >
                {isExpanded ? "▼" : "►"}
              </button>
            )}
          </div>

          {/* Data Cells */}
          <div style={{ ...cellStyle, width: `${денегНет - (level > 0 ? expandIconCellWidth/2 : 0) }px`, flexShrink: 0 }}>{account.code}</div>
          <div style={{ ...cellStyle, flexGrow: 1, minWidth: '150px' }}>{account.name}</div>
          <div style={{ ...cellStyle, width: `${typeWidth}px`, flexShrink: 0 }}>{account.type?.name}</div>
          <div style={{ ...cellStyle, flexGrow: 1, minWidth: '100px' }}>{account.notes || '-'}</div>
          <div style={{ ...cellStyle, width: `${balanceWidth}px`, textAlign: "right", flexShrink: 0 }}>
            {account.balance != null ? account.balance.toLocaleString() : '-'}
          </div>
        </div>
        {/* Recursive Call for Children */}
        {isExpanded && account.children && (
          <div>
            {account.children.length > 0 ? (
              account.children.map(child => renderAccountRow(child, level + 1, account))
            ) : (
              <div style={{ padding: `12px 8px 12px ${currentIndent + baseIndent + expandIconCellWidth}px`, fontStyle: "italic", color: "#888", backgroundColor: level % 2 === 0 ? "#fafafa" : "#ffffff" }}>
                Tidak ada sub-akun.
              </div>
            )}
          </div>
        )}
         {isExpanded && !account.children && canExpand && (
             <div style={{ padding: `12px 8px 12px ${currentIndent + baseIndent + expandIconCellWidth}px`, fontStyle: "italic", color: "#888", backgroundColor: level % 2 === 0 ? "#fafafa" : "#ffffff" }}>
               Memuat sub-akun...
             </div>
        )}
      </React.Fragment>
    );
  };


  const expandedRowRenderAntD = (record: Account) => {
    if (!record.children) {
        if (record.has_children === false || (typeof record.children_count === 'number' && record.children_count === 0)) {
            return <div style={{ padding: "12px 8px", fontStyle: "italic", color: "#888" }}>Tidak ada sub-akun.</div>;
        }
        return <div style={{ padding: "12px 8px", fontStyle: "italic", color: "#888" }}>Memuat sub-akun...</div>;
    }
    if (record.children.length === 0) {
        return <div style={{ padding: "12px 8px", fontStyle: "italic", color: "#888" }}>Tidak ada sub-akun.</div>;
    }
    // Pass the parent record (record from AntD table) to renderAccountRow
    return record.children.map(child => renderAccountRow(child, 1, record));
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
          onClick: () => onRowClick(record), // This is for the main AntD row
          style: { cursor: "pointer" },
        })}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectionChange,
        }}
        expandable={{
          expandedRowKeys: expandedRowKeys,
          onExpand: onExpand,
          rowExpandable: (record) => {
            console.log(`Account ID: ${record.id}, Name: ${record.name}, has_children: ${record.has_children} (type: ${typeof record.has_children}), children_count: ${record.children_count} (type: ${typeof record.children_count}), children prop defined: ${record.children !== undefined}`);

            const hasChildrenFlag = record.has_children === true;
            const positiveChildrenCount = typeof record.children_count === 'number' && record.children_count > 0;
            const childrenLoadedAndPresent = Array.isArray(record.children) && record.children.length > 0;

            const shouldExpand = hasChildrenFlag || positiveChildrenCount || childrenLoadedAndPresent;
            // console.log(`ID: ${record.id}, shouldExpand: ${shouldExpand}`);
            return shouldExpand;
          },
          // expandedRowRender is now completely removed.
          // AntD should use its default mechanism for rendering 'children' if data source has it.
          // expandIcon: ({ expanded, onExpand, record }) => ... custom icon if needed
        }}
      />
    </div>
  );
}
