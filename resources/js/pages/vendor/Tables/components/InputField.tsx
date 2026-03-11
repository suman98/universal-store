import { Column } from './types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface InputFieldProps {
    column: Column;
    value: any;
    onChange: (value: any) => void;
}

const formatDateForInput = (value: any): string => {
    if (!value) return '';
    
    // If it's already in YYYY-MM-DD format, return as-is
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return value;
    }
    
    // Convert to Date object and format as YYYY-MM-DD
    const date = new Date(value);
    if (isNaN(date.getTime())) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
};

export default function InputField({ column, value, onChange }: InputFieldProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let inputValue: any = e.target.value;

        if (column.type === 'number') {
            inputValue = inputValue === '' ? null : Number(inputValue);
        } else if (column.type === 'boolean') {
            inputValue = inputValue === 'true' ? true : inputValue === 'false' ? false : null;
        } else if (column.type === 'date') {
            inputValue = inputValue === '' ? null : inputValue;
        } else {
            inputValue = inputValue === '' ? null : inputValue;
        }

        onChange(inputValue);
    };
    
    return (
        <div className="space-y-2">
            <Label htmlFor={`field-${column.id}`} className="text-xs font-semibold uppercase">
                {column.display_name}
            </Label>
            <Input
                id={`field-${column.id}`}
                type={
                    column.type === 'number'
                        ? 'number'
                        : column.type === 'date'
                          ? 'date'
                          : 'text'
                }
                value={
                    column.type === 'number'
                        ? (value ?? '')
                        : column.type === 'boolean'
                          ? value === null || value === undefined ? '' : value
                          : column.type === 'date'
                            ? formatDateForInput(value)
                            : (value === null || value === undefined ? '' : value)
                }
                onChange={handleChange}
                placeholder={`Enter ${column.display_name.toLowerCase()}`}
            />
        </div>
    );
}
