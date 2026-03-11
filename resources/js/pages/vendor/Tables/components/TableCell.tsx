import FieldDisplay from '@/components/FieldDisplay';

interface TableCellProps {
    value: string | number | boolean | null;
    title?: string;
}

export default function TableCell({ value, title }: TableCellProps) {
    return (
        <td
            className="px-6 py-4 text-sm whitespace-nowrap truncate max-w-xs"
            title={title || String(value || '')}
        >
            <FieldDisplay value={value} />
        </td>
    );
}
