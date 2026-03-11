import { Column, Row } from './types';

export const getCellValue = (row: Row, column: Column): string | number | boolean | null => {
    const cellValue = row.values.find((v) => v.column_id === column.id);
    if (!cellValue) return null;

    switch (column.type) {
        case 'string':
            return cellValue.value_string;
        case 'number':
            return cellValue.value_number;
        case 'date':
            return cellValue.value_date ? new Date(cellValue.value_date).toLocaleDateString() : null;
        case 'boolean':
            return cellValue.value_boolean ? 'Yes' : 'No';
        case 'text':
            return cellValue.value_text;
        case 'json':
            return cellValue.value_json ? JSON.stringify(cellValue.value_json) : null;
        default:
            return null;
    }
};

export const getEditDataFromRow = (row: Row, columns: Column[]): Record<number, any> => {
    const editData: Record<number, any> = {};
    columns.forEach((col) => {
        const cellValue = row.values.find((v) => v.column_id === col.id);
        const value = cellValue?.[`value_${col.type}`] ?? null;
        editData[col.id] = value;
    });
    return editData;
};

export const transformFlatDataToNested = (
    data: Record<number, any>,
    columns: Column[]
): Record<number, Record<string, any>> => {
    const nestedData: Record<number, Record<string, any>> = {};
    columns.forEach((col) => {
        nestedData[col.id] = {
            value_string: col.type === 'string' ? data[col.id] : null,
            value_number: col.type === 'number' ? data[col.id] : null,
            value_date: col.type === 'date' ? data[col.id] : null,
            value_boolean: col.type === 'boolean' ? data[col.id] : null,
            value_json: col.type === 'json' ? data[col.id] : null,
            value_text: col.type === 'text' ? data[col.id] : null,
        };
    });
    return nestedData;
};
