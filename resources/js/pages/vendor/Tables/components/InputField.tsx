import { Column } from './types';
import StringInput from './fields/fieldInput/StringInput';
import NumberInput from './fields/fieldInput/NumberInput';
import DateInput from './fields/fieldInput/DateInput';
import BooleanInput from './fields/fieldInput/BooleanInput';
import TextAreaInput from './fields/fieldInput/TextAreaInput';
import JSONInput from './fields/fieldInput/JSONInput';

interface InputFieldProps {
    column: Column;
    value: any;
    onChange: (value: any) => void;
}

export default function InputField({ column, value, onChange }: InputFieldProps) {
    const fieldId = `field-${column.id}`;
    const fieldLabel = column.display_name;
    const fieldPlaceholder = `Enter ${column.display_name.toLowerCase()}`;

    switch (column.type) {
        case 'string':
            return (
                <StringInput
                    id={fieldId}
                    label={fieldLabel}
                    value={value}
                    onChange={onChange}
                    placeholder={fieldPlaceholder}
                />
            );

        case 'number':
            return (
                <NumberInput
                    id={fieldId}
                    label={fieldLabel}
                    value={value}
                    onChange={onChange}
                    placeholder={fieldPlaceholder}
                />
            );

        case 'date':
            return (
                <DateInput
                    id={fieldId}
                    label={fieldLabel}
                    value={value}
                    onChange={onChange}
                    placeholder={fieldPlaceholder}
                />
            );

        case 'boolean':
            return (
                <BooleanInput
                    id={fieldId}
                    label={fieldLabel}
                    value={value}
                    onChange={onChange}
                />
            );

        case 'text':
            return (
                <TextAreaInput
                    id={fieldId}
                    label={fieldLabel}
                    value={value}
                    onChange={onChange}
                    placeholder={fieldPlaceholder}
                />
            );

        case 'json':
            return (
                <JSONInput
                    id={fieldId}
                    label={fieldLabel}
                    value={value}
                    onChange={onChange}
                    placeholder={`{"key": "value"}`}
                />
            );

        default:
            return (
                <StringInput
                    id={fieldId}
                    label={fieldLabel}
                    value={value}
                    onChange={onChange}
                    placeholder={fieldPlaceholder}
                />
            );
    }
}
