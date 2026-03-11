interface RowCounterProps {
    count: number;
}

export default function RowCounter({ count }: RowCounterProps) {
    if (count === 0) return null;

    return (
        <div className="mt-4 text-xs text-gray-500 text-right">
            {count} {count === 1 ? 'row' : 'rows'}
        </div>
    );
}
