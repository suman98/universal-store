import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';

interface BooleanFilterProps {
    columnId: number;
    columnName: string;
    filterValue: any;
    onFilterChange: (columnId: number, value: any) => void;
}

export default function BooleanFilter({
    columnId,
    columnName,
    filterValue,
    onFilterChange,
}: BooleanFilterProps) {
    return (
        <Select 
            value={filterValue || ''}
            onValueChange={(val) => onFilterChange(columnId, val)}
        >
            <SelectTrigger className="w-[140px]">
                <SelectValue placeholder={columnName} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="">All</SelectItem>
                <SelectItem value="true">True</SelectItem>
                <SelectItem value="false">False</SelectItem>
            </SelectContent>
        </Select>
    );
}
