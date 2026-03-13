export function matchesFilter(
    cellValue: any,
    filterValue: any,
    columnType: string
): boolean {
    if (!filterValue && filterValue !== false && filterValue !== 0) return true;

    switch (columnType) {
        case 'number':
            const numValue = Number(cellValue);
            if (filterValue.comparison) {
                const filterNum = Number(filterValue.value);
                switch (filterValue.comparison) {
                    case 'equals':
                        return numValue === filterNum;
                    case 'greater':
                        return numValue > filterNum;
                    case 'less':
                        return numValue < filterNum;
                    case 'greaterOrEqual':
                        return numValue >= filterNum;
                    case 'lessOrEqual':
                        return numValue <= filterNum;
                    default:
                        return true;
                }
            }
            return String(numValue).includes(String(filterValue));

        case 'boolean':
            return String(cellValue).toLowerCase() === String(filterValue).toLowerCase();

        case 'date':
            if (filterValue.startDate && filterValue.endDate) {
                const cellDate = new Date(cellValue).getTime();
                const startDate = new Date(filterValue.startDate).getTime();
                const endDate = new Date(filterValue.endDate).getTime();
                return cellDate >= startDate && cellDate <= endDate;
            } else if (filterValue.startDate) {
                return new Date(cellValue).getTime() >= new Date(filterValue.startDate).getTime();
            } else if (filterValue.endDate) {
                return new Date(cellValue).getTime() <= new Date(filterValue.endDate).getTime();
            } else if (filterValue.value) {
                return cellValue.includes(filterValue.value);
            }
            return true;

        case 'string':
        case 'text':
        default:
            return String(cellValue).toLowerCase().includes(String(filterValue).toLowerCase());
    }
}

export function isFilterActive(filters: Record<number, any>): boolean {
    return Object.values(filters).some(f => f !== undefined && f !== '' && f !== null);
}
