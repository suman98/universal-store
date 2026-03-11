import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface BooleanInputProps {
    id: string;
    label: string;
    value: boolean | null | undefined;
    onChange: (value: boolean | null) => void;
    disabled?: boolean;
}

export default function BooleanInput({
    id,
    label,
    value,
    onChange,
    disabled = false,
}: BooleanInputProps) {
    const handleChange = (checked: boolean) => {
        onChange(checked);
    };

    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-xs font-semibold uppercase">
                {label}
            </Label>
            <div className="flex items-center gap-2 mt-2">
                <Checkbox
                    id={id}
                    checked={value ?? false}
                    onCheckedChange={handleChange}
                    disabled={disabled}
                />
                <span className="text-sm text-muted-foreground">
                    {value ? 'Yes' : 'No'}
                </span>
            </div>
        </div>
    );
}
