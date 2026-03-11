import { Column } from './types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface InputFieldProps {
    column: Column;
    value: any;
    onChange: (value: any) => void;
}

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
                            ? (value ?? '')
                            : (value === null || value === undefined ? '' : value)
                }
                onChange={handleChange}
                placeholder={`Enter ${column.display_name.toLowerCase()}`}
            />
        </div>
    );
}
