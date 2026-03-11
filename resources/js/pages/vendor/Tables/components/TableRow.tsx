import { Column, Row } from './types';
import TableCell from './TableCell';
import { getCellValue } from './utils';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Loader2 } from 'lucide-react';

interface TableRowProps {
    row: Row;
    columns: Column[];
    editingRowId: number | null;
    deletingRowId: number | null;
    onEdit: (row: Row) => void;
    onDelete: (id: number) => void;
}

export default function TableRow({
    row,
    columns,
    editingRowId,
    deletingRowId,
    onEdit,
    onDelete,
}: TableRowProps) {
    return (
        <tr className="hover:bg-accent/50 transition">
            {columns.map((column) => {
                const cellValue = getCellValue(row, column);
                return (
                    <TableCell
                        key={`${row.id}-${column.id}`}
                        value={cellValue}
                        title={String(cellValue || '')}
                    />
                );
            })}
            <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(row)}
                        disabled={editingRowId !== null || deletingRowId !== null}
                        className="gap-1"
                    >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit
                    </Button>
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onDelete(row.id)}
                        disabled={editingRowId !== null || deletingRowId === row.id}
                        className="gap-1"
                    >
                        {deletingRowId === row.id ? (
                            <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                            </>
                        )}
                    </Button>
                </div>
            </td>
        </tr>
    );
}
