import { Badge } from '@/components/ui/badge';

interface BooleanDisplayProps {
    value: any;
}

export default function BooleanDisplay({ value }: BooleanDisplayProps) {
    if (value === null || value === undefined) {
        return <span>-</span>;
    }

    const isTrue = value === true || value === 'true' || value === 1 || value === '1';

    return (
        <Badge variant={isTrue ? 'default' : 'secondary'}>
            {isTrue ? 'Yes' : 'No'}
        </Badge>
    );
}
