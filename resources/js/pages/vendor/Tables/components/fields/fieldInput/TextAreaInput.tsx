import { Label } from '@/components/ui/label';

interface TextAreaInputProps {
    id: string;
    label: string;
    value: string | null | undefined;
    onChange: (value: string | null) => void;
    placeholder?: string;
    disabled?: boolean;
    rows?: number;
}

export default function TextAreaInput({
    id,
    label,
    value,
    onChange,
    placeholder,
    disabled = false,
    rows = 4,
}: TextAreaInputProps) {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const inputValue = e.target.value === '' ? null : e.target.value;
        onChange(inputValue);
    };

    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-xs font-semibold uppercase">
                {label}
            </Label>
            <textarea
                id={id}
                value={value ?? ''}
                onChange={handleChange}
                placeholder={placeholder}
                disabled={disabled}
                rows={rows}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
        </div>
    );
}
