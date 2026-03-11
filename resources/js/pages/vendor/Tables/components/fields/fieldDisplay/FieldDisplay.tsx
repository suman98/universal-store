import { Column } from '../../types';
import StringDisplay from './StringDisplay';
import NumberDisplay from './NumberDisplay';
import DateDisplay from './DateDisplay';
import BooleanDisplay from './BooleanDisplay';
import TextDisplay from './TextDisplay';
import JSONDisplay from './JSONDisplay';

interface FieldDisplayProps {
    column: Column;
    value: any;
}

export default function FieldDisplay({ column, value }: FieldDisplayProps) {
    switch (column.type) {
        case 'string':
            return <StringDisplay value={value} />;

        case 'number':
            return <NumberDisplay value={value} />;

        case 'date':
            return <DateDisplay value={value} />;

        case 'boolean':
            return <BooleanDisplay value={value} />;

        case 'text':
            return <TextDisplay value={value} maxLength={100} />;

        case 'json':
            return <JSONDisplay value={value} />;

        default:
            return <StringDisplay value={value} />;
    }
}
