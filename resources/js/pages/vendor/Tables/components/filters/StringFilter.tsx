import { Input } from '@/components/ui/input';

interface StringFilterProps {
    columnId: number;
    columnName: string;
    filterValue: any;
    onFilterChange: (columnId: number, value: any) => void;
}

export default function StringFilter({
    columnId,
    columnName,
    filterValue,
    onFilterChange,
}: StringFilterProps) {
    return (
        <Input
            placeholder={columnName}
            value={filterValue || ''}
            onChange={(e) => onFilterChange(columnId, e.target.value)}
            className="w-[150px]"
        />
    );
}
