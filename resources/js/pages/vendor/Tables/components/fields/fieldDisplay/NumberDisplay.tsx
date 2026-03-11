interface NumberDisplayProps {
    value: any;
}

export default function NumberDisplay({ value }: NumberDisplayProps) {
    if (value === null || value === undefined) return <span>-</span>;
    
    return <span>{Number(value).toLocaleString()}</span>;
}
