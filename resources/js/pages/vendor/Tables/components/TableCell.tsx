interface TableCellProps {
    value: string | number | boolean | null;
    title?: string;
}

export default function TableCell({ value, title }: TableCellProps) {
    return (
        <td
            className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap truncate max-w-xs"
            title={title || String(value || '')}
        >
            {value !== null && value !== undefined ? (
                value
            ) : (
                <span className="text-gray-400">—</span>
            )}
        </td>
    );
}
