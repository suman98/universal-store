interface DateDisplayProps {
    value: any;
}

export default function DateDisplay({ value }: DateDisplayProps) {
    if (!value) return <span>-</span>;

    try {
        const date = new Date(value);
        if (isNaN(date.getTime())) return <span>-</span>;
        
        return <span>{date.toLocaleDateString()}</span>;
    } catch {
        return <span>-</span>;
    }
}
