import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface StringInputProps {
    id: string;
    label: string;
    value: string | null | undefined;
    onChange: (value: string | null) => void;
    placeholder?: string;
    disabled?: boolean;
}

export default function StringInput({
    id,
    label,
    value,
    onChange,
    placeholder,
    disabled = false,
}: StringInputProps) {
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
                type="text"
                value={value ?? ''}
                onChange={handleChange}
                placeholder={placeholder}
                disabled={disabled}
            />
        </div>
    );
}
