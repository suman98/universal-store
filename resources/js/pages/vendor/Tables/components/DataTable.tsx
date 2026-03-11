import { Column, Row } from './types';
import TableRow from './TableRow';
import EmptyState from './EmptyState';

interface DataTableProps {
    rows: Row[];
    columns: Column[];
    editingRowId: number | null;
    deletingRowId: number | null;
    onEditRow: (row: Row) => void;
    onDeleteRow: (id: number) => void;
}

export default function DataTable({
    rows,
    columns,
    editingRowId,
    deletingRowId,
    onEditRow,
    onDeleteRow,
}: DataTableProps) {
    return (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
            {rows.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-gray-200 bg-gray-50">
                            <tr>
                                {columns.map((column) => (
                                    <th
                                        key={column.id}
                                        className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide"
                                    >
                                        {column.display_name}
                                    </th>
                                ))}
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    row={row}
                                    columns={columns}
                                    editingRowId={editingRowId}
                                    deletingRowId={deletingRowId}
                                    onEdit={onEditRow}
                                    onDelete={onDeleteRow}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
