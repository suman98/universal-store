import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DateInputProps {
    id: string;
    label: string;
    value: string | null | undefined;
    onChange: (value: string | null) => void;
    placeholder?: string;
    disabled?: boolean;
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

export default function DateInput({
    id,
    label,
    value,
    onChange,
    placeholder,
    disabled = false,
}: DateInputProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value === '' ? null : e.target.value;
        onChange(inputValue);
    };

    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-xs font-semibold uppercase">
                {label}
            </Label>
            <Input
                id={id}
                type="date"
                value={formatDateForInput(value)}
                onChange={handleChange}
                placeholder={placeholder}
                disabled={disabled}
            />
        </div>
    );
}
