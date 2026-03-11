import { Card, CardContent } from '@/components/ui/card';
import EmptyState from './EmptyState';
import TableRow from './TableRow';
import type { Column, Row } from './types';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface DataTableProps {
    rows: Row[];
    columns: Column[];
    editingRowId: number | null;
    deletingRowId: number | null;
    onEditRow: (row: Row) => void;
    onDeleteRow: (id: number) => void;
    sortColumn?: number | null;
    sortDirection?: 'asc' | 'desc';
    onSort?: (columnId: number) => void;
}

export default function DataTable({
    rows,
    columns,
    editingRowId,
    deletingRowId,
    onEditRow,
    onDeleteRow,
    sortColumn,
    sortDirection,
    onSort,
}: DataTableProps) {
    return (
        <Card>
            <CardContent className="p-0">
                {rows.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-border bg-muted">
                                <tr>
                                    {columns.map((column) => (
                                        <th
                                            key={column.id}
                                            onClick={() => onSort?.(column.id)}
                                            className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wide cursor-pointer hover:bg-muted/80 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                {column.display_name}
                                                {sortColumn === column.id && (
                                                    sortDirection === 'asc' ? (
                                                        <ArrowUp className="h-3.5 w-3.5 text-primary" />
                                                    ) : (
                                                        <ArrowDown className="h-3.5 w-3.5 text-primary" />
                                                    )
                                                )}
                                            </div>
                                        </th>
                                    ))}
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wide">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
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
            </CardContent>
        </Card>
    );
}
