import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface NumberInputProps {
    id: string;
    label: string;
    value: number | null | undefined;
    onChange: (value: number | null) => void;
    placeholder?: string;
    disabled?: boolean;
}

export default function NumberInput({
    id,
    label,
    value,
    onChange,
    placeholder,
    disabled = false,
}: NumberInputProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value === '' ? null : Number(e.target.value);
        onChange(inputValue);
    };

    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-xs font-semibold uppercase">
                {label}
            </Label>
            <Input
                id={id}
                type="number"
                value={value ?? ''}
                onChange={handleChange}
                placeholder={placeholder}
                disabled={disabled}
            />
        </div>
    );
}
