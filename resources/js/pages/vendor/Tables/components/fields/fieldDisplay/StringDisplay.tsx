interface StringDisplayProps {
    value: any;
}

export default function StringDisplay({ value }: StringDisplayProps) {
    return <span>{value ?? '-'}</span>;
}
