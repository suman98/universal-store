export interface Column {
    id: number;
    name: string;
    display_name: string;
    type: 'string' | 'number' | 'date' | 'boolean' | 'json' | 'text';
    position: number;
}

export interface CellValue {
    id: number;
    row_id: number;
    column_id: number;
    value_string: string | null;
    value_number: number | null;
    value_date: string | null;
    value_boolean: boolean | null;
    value_json: Record<string, any> | null;
    value_text: string | null;
}

export interface Row {
    id: number;
    table_id: number;
    created_by: number;
    created_at: string;
    values: CellValue[];
}

export interface Table {
    id: number;
    name: string;
    display_name: string;
    description: string | null;
}
