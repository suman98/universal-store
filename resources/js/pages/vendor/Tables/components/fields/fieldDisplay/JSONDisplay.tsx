import { Badge } from '@/components/ui/badge';

interface JSONDisplayProps {
    value: any;
}

export default function JSONDisplay({ value }: JSONDisplayProps) {
    if (!value) return <span>-</span>;

    try {
        const parsed = typeof value === 'string' ? JSON.parse(value) : value;
        const keyCount = Object.keys(parsed).length;

        return (
            <Badge variant="outline" className="font-mono text-xs">
                {`{...} (${keyCount} keys)`}
            </Badge>
        );
    } catch {
        return (
            <span className="text-xs text-muted-foreground">
                {String(value).substring(0, 30)}...
            </span>
        );
    }
}
