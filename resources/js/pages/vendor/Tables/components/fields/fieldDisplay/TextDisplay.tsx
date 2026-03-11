interface TextDisplayProps {
    value: any;
    maxLength?: number;
}

export default function TextDisplay({ value, maxLength = 100 }: TextDisplayProps) {
    if (!value) return <span>-</span>;

    const text = String(value);
    const truncated = text.length > maxLength ? text.substring(0, maxLength) + '...' : text;

    return (
        <span className="text-muted-foreground" title={text}>
            {truncated}
        </span>
    );
}
