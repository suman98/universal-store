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
    const { table, columns, rows } = usePage().props as unknown as {
        table: Table;
        columns: Column[];
        rows: Row[];
    };

    const [showNewRowForm, setShowNewRowForm] = useState(false);
    const [editingRowId, setEditingRowId] = useState<number | null>(null);
    const [deletingRowId, setDeletingRowId] = useState<number | null>(null);

    const { data, setData, post, processing, reset } = useForm({
        values: {} as Record<number, Record<string, any>>,
    });

    const { put: updateRow, delete: deleteRow, processing: updateProcessing } = useForm({
        values: {} as Record<number, Record<string, any>>,
    });

    const handleAddRow = () => {
        post(route('vendor.rows.store', table.id), {
            onSuccess: () => {
                reset();
                setShowNewRowForm(false);
            },
        });
    };

    const handleEditRow = (row: Row) => {
        setEditingRowId(row.id);
        const editData: Record<number, Record<string, any>> = {};

        columns.forEach((col) => {
            const cellValue = row.values.find((v) => v.column_id === col.id);
            editData[col.id] = {
                value_string: cellValue?.value_string || null,
                value_number: cellValue?.value_number || null,
                value_date: cellValue?.value_date || null,
                value_boolean: cellValue?.value_boolean || null,
                value_json: cellValue?.value_json || null,
                value_text: cellValue?.value_text || null,
            };
        });

        updateRow.setData('values', editData);
    };

    const handleSaveEdit = () => {
        if (editingRowId) {
            updateRow.put(route('vendor.rows.update', { tableId: table.id, id: editingRowId }), {
                onSuccess: () => {
                    setEditingRowId(null);
                    updateRow.reset();
                },
            });
        }
    };

    const handleDeleteRow = (rowId: number) => {
        if (confirm('Are you sure you want to delete this row?')) {
            deleteRow.delete(route('vendor.rows.destroy', { tableId: table.id, id: rowId }), {
                onSuccess: () => {
                    setDeletingRowId(null);
                },
            });
        }
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
                return cellValue.value_date
                    ? new Date(cellValue.value_date).toLocaleDateString()
                    : null;
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
                            {table.description && (
                                <p className="mt-2 text-gray-600">{table.description}</p>
                            )}
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
                {!showNewRowForm && editingRowId === null && (
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
                {showNewRowForm && editingRowId === null && (
                    <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-6">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">Add New Row</h3>
                        <div className="space-y-4">
                            {columns.map((column) => (
                                <div key={column.id}>
                                    <label className="block text-sm font-medium text-gray-700">
                                        {column.display_name}
                                    </label>
                                    <input
                                        type={
                                            column.type === 'number'
                                                ? 'number'
                                                : column.type === 'date'
                                                  ? 'date'
                                                  : 'text'
                                        }
                                        value={
                                            data.values[column.id]?.[`value_${column.type}`] ===
                                                null ||
                                            data.values[column.id]?.[`value_${column.type}`] ===
                                                undefined
                                                ? ''
                                                : data.values[column.id]?.[
                                                      `value_${column.type}`
                                                  ] || ''
                                        }
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setData('values', {
                                                ...data.values,
                                                [column.id]: {
                                                    ...data.values[column.id],
                                                    [`value_${column.type}`]: value || null,
                                                },
                                            });
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

                {/* Edit Row Form */}
                {editingRowId !== null && (
                    <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-6">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">Edit Row</h3>
                        <div className="space-y-4">
                            {columns.map((column) => (
                                <div key={column.id}>
                                    <label className="block text-sm font-medium text-gray-700">
                                        {column.display_name}
                                    </label>
                                    <input
                                        type={
                                            column.type === 'number'
                                                ? 'number'
                                                : column.type === 'date'
                                                  ? 'date'
                                                  : 'text'
                                        }
                                        value={
                                            updateRow.data.values[column.id]?.[
                                                `value_${column.type}`
                                            ] === null ||
                                            updateRow.data.values[column.id]?.[
                                                `value_${column.type}`
                                            ] === undefined
                                                ? ''
                                                : updateRow.data.values[column.id]?.[
                                                      `value_${column.type}`
                                                  ] || ''
                                        }
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            updateRow.setData('values', {
                                                ...updateRow.data.values,
                                                [column.id]: {
                                                    ...updateRow.data.values[column.id],
                                                    [`value_${column.type}`]: value || null,
                                                },
                                            });
                                        }}
                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        placeholder={`Enter ${column.display_name}`}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 flex gap-2">
                            <button
                                onClick={handleSaveEdit}
                                disabled={updateProcessing}
                                className="rounded-lg bg-amber-600 px-6 py-2 font-semibold text-white hover:bg-amber-700 transition disabled:opacity-50"
                            >
                                {updateProcessing ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                onClick={() => {
                                    setEditingRowId(null);
                                    updateRow.reset();
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
                            <p className="text-gray-500">
                                No data yet. Add your first row to get started.
                            </p>
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
                                            <button
                                                onClick={() => handleEditRow(row)}
                                                disabled={editingRowId !== null}
                                                className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteRow(row.id)}
                                                disabled={
                                                    editingRowId !== null ||
                                                    deletingRowId === row.id
                                                }
                                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                            >
                                                Delete
                                            </button>
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
