import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';

interface JSONInputProps {
    id: string;
    label: string;
    value: string | object | null | undefined;
    onChange: (value: string | null) => void;
    placeholder?: string;
    disabled?: boolean;
}

export default function JSONInput({
    id,
    label,
    value,
    onChange,
    placeholder = '{"key": "value"}',
    disabled = false,
}: JSONInputProps) {
    const [textValue, setTextValue] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (value === null || value === undefined) {
            setTextValue('');
        } else if (typeof value === 'string') {
            setTextValue(value);
        } else {
            setTextValue(JSON.stringify(value, null, 2));
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const inputValue = e.target.value;
        setTextValue(inputValue);

        if (inputValue === '') {
            setError(null);
            onChange(null);
            return;
        }

        try {
            JSON.parse(inputValue);
            setError(null);
            onChange(inputValue);
        } catch {
            setError('Invalid JSON format');
        }
    };

    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-xs font-semibold uppercase">
                {label}
            </Label>
            <textarea
                id={id}
                value={textValue}
                onChange={handleChange}
                placeholder={placeholder}
                disabled={disabled}
                rows={6}
                className={`flex w-full rounded-md border font-mono text-sm px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                    error ? 'border-red-500 focus-visible:ring-red-500' : 'border-input focus-visible:ring-ring'
                }`}
            />
            {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
    );
}
