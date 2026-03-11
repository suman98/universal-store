import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { route } from '@/lib/route';

interface Column {
    id: number;
    name: string;
    display_name: string;
    type: 'string' | 'number' | 'date' | 'boolean' | 'json' | 'text';
    position: number;
}

interface CellValue {
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

interface Row {
    id: number;
    table_id: number;
    created_by: number;
    created_at: string;
    values: CellValue[];
}

interface Table {
    id: number;
    name: string;
    display_name: string;
    description: string | null;
}

export default function Show() {
    const { table, columns, rows } = usePage().props as {
        table: Table;
        columns: Column[];
        rows: Row[];
    };

    const [showNewRowForm, setShowNewRowForm] = useState(false);
    const { data, setData, post, processing, reset } = useForm<Record<number, Record<string, any>>>({});

    const handleAddRow = () => {
        const formData = new FormData();
        const values: Record<number, any> = {};

        columns.forEach((col) => {
            values[col.id] = {
                value_string: data[col.id]?.value_string || null,
                value_number: data[col.id]?.value_number || null,
                value_date: data[col.id]?.value_date || null,
                value_boolean: data[col.id]?.value_boolean || null,
                value_json: data[col.id]?.value_json || null,
                value_text: data[col.id]?.value_text || null,
            };
        });

        post(route('vendor.rows.store', table.id), {
            data: { values },
            onSuccess: () => {
                reset();
                setShowNewRowForm(false);
            },
        });
    };

    const getCellValue = (row: Row, column: Column) => {
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

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <Head title={table.display_name} />

            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{table.display_name}</h1>
                            {table.description && <p className="mt-2 text-gray-600">{table.description}</p>}
                        </div>
                        <div className="flex gap-2">
                            <Link
                                href={route('vendor.tables.edit', table.id)}
                                className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50 transition"
                            >
                                Edit Table
                            </Link>
                            <Link
                                href={route('vendor.tables.index')}
                                className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50 transition"
                            >
                                Back
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Add New Row Button */}
                {!showNewRowForm && (
                    <div className="mb-6">
                        <button
                            onClick={() => setShowNewRowForm(true)}
                            className="rounded-lg bg-green-600 px-6 py-2 font-semibold text-white hover:bg-green-700 transition"
                        >
                            Add New Row
                        </button>
                    </div>
                )}

                {/* New Row Form */}
                {showNewRowForm && (
                    <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-6">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">Add New Row</h3>
                        <div className="space-y-4">
                            {columns.map((column) => (
                                <div key={column.id}>
                                    <label className="block text-sm font-medium text-gray-700">
                                        {column.display_name}
                                    </label>
                                    <input
                                        type={column.type === 'number' ? 'number' : column.type === 'date' ? 'date' : 'text'}
                                        value={
                                            data[column.id]?.[`value_${column.type}`] === null ||
                                            data[column.id]?.[`value_${column.type}`] === undefined
                                                ? ''
                                                : data[column.id]?.[`value_${column.type}`] || ''
                                        }
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setData((prevData) => ({
                                                ...prevData,
                                                [column.id]: {
                                                    ...prevData[column.id],
                                                    [`value_${column.type}`]: value || null,
                                                },
                                            }));
                                        }}
                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        placeholder={`Enter ${column.display_name}`}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 flex gap-2">
                            <button
                                onClick={handleAddRow}
                                disabled={processing}
                                className="rounded-lg bg-green-600 px-6 py-2 font-semibold text-white hover:bg-green-700 transition disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : 'Save Row'}
                            </button>
                            <button
                                onClick={() => {
                                    reset();
                                    setShowNewRowForm(false);
                                }}
                                className="rounded-lg border border-gray-300 px-6 py-2 font-semibold text-gray-700 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Table Data */}
                <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-x-auto">
                    {rows.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-gray-500">No data yet. Add your first row to get started.</p>
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {columns.map((column) => (
                                        <th
                                            key={column.id}
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                                        >
                                            {column.display_name}
                                        </th>
                                    ))}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {rows.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50">
                                        {columns.map((column) => (
                                            <td
                                                key={`${row.id}-${column.id}`}
                                                className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap"
                                            >
                                                {getCellValue(row, column) || '-'}
                                            </td>
                                        ))}
                                        <td className="px-6 py-4 text-sm font-medium space-x-2 whitespace-nowrap">
                                            <button className="text-blue-600 hover:text-blue-900">Edit</button>
                                            <button className="text-red-600 hover:text-red-900">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
