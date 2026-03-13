import { Input } from '@/components/ui/input';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';

interface NumberFilterProps {
    columnId: number;
    columnName: string;
    filterValue: any;
    onFilterChange: (columnId: number, value: any) => void;
}

export default function NumberFilter({
    columnId,
    columnName,
    filterValue,
    onFilterChange,
}: NumberFilterProps) {
    return (
        <>
            <Select 
                value={filterValue?.comparison || 'equals'}
                onValueChange={(val) => onFilterChange(columnId, {
                    ...filterValue,
                    comparison: val
                })}
            >
                <SelectTrigger className="w-[100px]">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="equals">Equals</SelectItem>
                    <SelectItem value="greater">&gt;</SelectItem>
                    <SelectItem value="less">&lt;</SelectItem>
                    <SelectItem value="greaterOrEqual">≥</SelectItem>
                    <SelectItem value="lessOrEqual">≤</SelectItem>
                </SelectContent>
            </Select>
            <Input
                type="number"
                placeholder={columnName}
                value={filterValue?.value || ''}
                onChange={(e) => onFilterChange(columnId, {
                    ...filterValue,
                    value: e.target.value
                })}
                className="w-[120px]"
            />
        </>
    );
}
