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

const InputField = ({
    column,
    value,
    onChange,
}: {
    column: Column;
    value: any;
    onChange: (value: any) => void;
}) =>
     (
    <div className="group">
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
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
                column.type === 'number'
                    ? (value ?? '')
                    : column.type === 'boolean'
                        ? value === null || value === undefined ? '' : value
                        : column.type === 'date'
                            ? (value ?? '')
                            : (value === null || value === undefined ? '' : value)
            }
            onChange={(e) => {
                let inputValue: any = e.target.value;
                // handle number type (always send value as number or null)
                if (column.type === 'number') {
                    inputValue = inputValue === '' ? null : Number(inputValue);
                } else if (column.type === 'boolean') {
                    inputValue = inputValue === 'true' ? true : inputValue === 'false' ? false : null;
                } else if (column.type === 'date') {
                    inputValue = inputValue === '' ? null : inputValue;
                } else {
                    inputValue = inputValue === '' ? null : inputValue;
                }
                onChange(inputValue);
            }}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition placeholder:text-gray-400"
            placeholder={`Enter ${column.display_name.toLowerCase()}`}
        />
    </div>
);

const EditModal = ({
    isOpen,
    title,
    columns,
    editingData,
    isLoading,
    onUpdate,
    onCancel,
}: {
    isOpen: boolean;
    title: string;
    columns: Column[];
    editingData: Record<number, any>;
    isLoading: boolean;
    onUpdate: (data: Record<number, any>) => void;
    onCancel: () => void;
}) => {
    const [localData, setLocalData] = useState<Record<number, any>>(editingData);

    if (!isOpen) return null;

    const handleFieldChange = (columnId: number, value: any) => {
        const updated = { ...localData, [columnId]: value };
        setLocalData(updated);
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
                onClick={onCancel}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Modal Header */}
                    <div className="sticky top-0 border-b border-gray-200 bg-white px-6 py-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                        <button
                            onClick={onCancel}
                            className="text-gray-500 hover:text-gray-700 transition"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Modal Content */}
                    <div className="px-6 py-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {columns.map((column) => (
                                <InputField
                                    key={column.id}
                                    column={column}
                                    value={localData[column.id]}
                                    onChange={(value) => handleFieldChange(column.id, value)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="sticky bottom-0 border-t border-gray-200 bg-gray-50 px-6 py-4 flex items-center justify-end gap-2">
                        <button
                            onClick={onCancel}
                            disabled={isLoading}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => onUpdate(localData)}
                            disabled={isLoading}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default function Show() {
    const { table, columns, rows } = usePage().props as unknown as {
        table: Table;
        columns: Column[];
        rows: Row[];
    };

    const [showNewRowForm, setShowNewRowForm] = useState(false);
    const [editingRowId, setEditingRowId] = useState<number | null>(null);
    const [editingData, setEditingData] = useState<Record<number, any>>({});
    const [deletingRowId, setDeletingRowId] = useState<number | null>(null);

    const { data, setData, post, processing, reset } = useForm({
        values: {} as Record<number, Record<string, any>>,
    });

    const deleteForm = useForm({
        values: {} as Record<number, any>,
    });

    const updateForm = useForm({
        values: {} as Record<number, any>,
    });

    const handleEditRow = (row: Row) => {
        const editData: Record<number, any> = {};

        columns.forEach((col) => {
            const cellValue = row.values.find((v) => v.column_id === col.id);
            const value = cellValue?.[`value_${col.type}`] ?? null;
            editData[col.id] = value;
        });

        setEditingData(editData);
        setEditingRowId(row.id);
    };

    const handleDeleteRow = (rowId: number) => {
        if (confirm('Are you sure? This cannot be undone.')) {
            setDeletingRowId(rowId);
            deleteForm.delete(route('vendor.rows.destroy', { tableId: table.id, id: rowId }), {
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <Head title={table.display_name} />

            {/* Header */}
            <div className="border-b border-gray-200 bg-white shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900">{table.display_name}</h1>
                            {table.description && (
                                <p className="mt-1 text-sm text-gray-600">{table.description}</p>
                            )}
                        </div>
                        <div className="ml-4 flex gap-2">
                            <Link
                                href={route('vendor.tables.edit', table.id)}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-7-11L20 7m0 0l-4-4m4 4l-4 4" />
                                </svg>
                                Settings
                            </Link>
                            <Link
                                href={route('vendor.tables.index')}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Add Row Button */}
                {!showNewRowForm && editingRowId === null && (
                    <div className="mb-6">
                        <button
                            onClick={() => setShowNewRowForm(true)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 transition shadow-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Row
                        </button>
                    </div>
                )}

                {/* New Row Card */}
                {showNewRowForm && editingRowId === null && (
                    <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50/50 p-6">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">Add New Row</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            {columns.map((column) => (
                                <InputField
                                    key={column.id}
                                    column={column}
                                    value={data.values[column.id]?.[`value_${column.type}`]}
                                    onChange={(value) => {
                                        setData('values', {
                                            ...data.values,
                                            [column.id]: {
                                                ...data.values[column.id],
                                                [`value_${column.type}`]: value,
                                            },
                                        });
                                    }}
                                />
                            ))}
                        </div>
                        <div className="flex gap-2 pt-4 border-t border-blue-200">
                            <button
                                onClick={() => {
                                    post(route('vendor.rows.store', table.id), {
                                        onSuccess: () => {
                                            reset();
                                            setShowNewRowForm(false);
                                        },
                                    });
                                }}
                                disabled={processing}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {processing ? 'Saving...' : 'Save'}
                            </button>
                            <button
                                onClick={() => {
                                    reset();
                                    setShowNewRowForm(false);
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Edit Row Modal */}
                <EditModal
                    isOpen={editingRowId !== null}
                    title="Edit Row"
                    columns={columns}
                    editingData={editingData}
                    isLoading={updateForm.processing}
                    onUpdate={(data) => {
                        // Transform flat data to nested structure
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
                        updateForm.setData('values', nestedData);
                        updateForm.put(route('vendor.rows.update', { tableId: table.id, id: editingRowId }), {
                            onSuccess: () => {
                                setEditingRowId(null);
                                setEditingData({});
                                updateForm.reset();
                            },
                        });
                    }}
                    onCancel={() => {
                        setEditingRowId(null);
                        setEditingData({});
                        updateForm.reset();
                    }}
                />

                {/* Table */}
                <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                    {rows.length === 0 ? (
                        <div className="p-12 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-gray-600 font-medium">No data yet</p>
                            <p className="text-sm text-gray-500 mt-1">Add your first row to get started</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b border-gray-200 bg-gray-50">
                                    <tr>
                                        {columns.map((column) => (
                                            <th
                                                key={column.id}
                                                className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide"
                                            >
                                                {column.display_name}
                                            </th>
                                        ))}
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {rows.map((row) => (
                                        <tr key={row.id} className="hover:bg-gray-50 transition">
                                            {columns.map((column) => (
                                                <td
                                                    key={`${row.id}-${column.id}`}
                                                    className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap truncate max-w-xs"
                                                    title={String(getCellValue(row, column) || '')}
                                                >
                                                    {getCellValue(row, column) || <span className="text-gray-400">—</span>}
                                                </td>
                                            ))}
                                            <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEditRow(row)}
                                                        disabled={editingRowId !== null}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 transition disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-7-11L20 7m0 0l-4-4m4 4l-4 4" />
                                                        </svg>
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteRow(row.id)}
                                                        disabled={editingRowId !== null || deletingRowId === row.id}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 transition disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Footer Info */}
                {rows.length > 0 && (
                    <div className="mt-4 text-xs text-gray-500 text-right">
                        {rows.length} {rows.length === 1 ? 'row' : 'rows'}
                    </div>
                )}
            </div>
        </div>
    );
}
