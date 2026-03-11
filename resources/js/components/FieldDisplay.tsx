interface FieldDisplayProps {
    value: string | number | boolean | null | undefined;
}

export default function FieldDisplay({ value }: FieldDisplayProps) {
    // Handle null or undefined values
    if (value === null || value === undefined) {
        return <span className="text-gray-400">—</span>;
    }

    // Handle boolean values
    if (typeof value === 'boolean') {
        return (
            <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    value
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}
            >
                {value ? 'True' : 'False'}
            </span>
        );
    }

    // Handle string and number values
    return <span>{value}</span>;
}
