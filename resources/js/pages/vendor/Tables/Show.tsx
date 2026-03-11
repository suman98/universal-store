import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { route } from '@/lib/route';

// Components
import PageHeader from './components/PageHeader';
import PageContainer from './components/PageContainer';
import ContentContainer from './components/ContentContainer';
import AddRowButton from './components/AddRowButton';
import NewRowForm from './components/NewRowForm';
import EditModal from './components/EditModal';
import DataTable from './components/DataTable';
import RowCounter from './components/RowCounter';

// Types & Utils
import { Table, Column, Row } from './components/types';
import { getEditDataFromRow, transformFlatDataToNested } from './components/utils';

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
        const editData = getEditDataFromRow(row, columns);
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

    const handleAddRowFieldChange = (columnId: number, value: any) => {
        setData('values', {
            ...data.values,
            [columnId]: {
                ...data.values[columnId],
                [`value_${columns.find(c => c.id === columnId)?.type}`]: value,
            },
        });
    };

    const handleUpdateRow = (flatData: Record<number, any>) => {
        const nestedData = transformFlatDataToNested(flatData, columns);
        updateForm.put(route('vendor.rows.update', { tableId: table.id, id: editingRowId }), {
            data: { values: nestedData },
            onSuccess: () => {
                setEditingRowId(null);
                setEditingData({});
                updateForm.reset();
            },
        });
    };

    return (
        <PageContainer>
            <Head title={table.display_name} />
            
            <PageHeader table={table} />

            <ContentContainer>
                {/* Add Row Button */}
                {!showNewRowForm && editingRowId === null && (
                    <AddRowButton onClick={() => setShowNewRowForm(true)} />
                )}

                {/* New Row Form */}
                {showNewRowForm && editingRowId === null && (
                    <NewRowForm
                        columns={columns}
                        formData={data.values}
                        isLoading={processing}
                        onFieldChange={handleAddRowFieldChange}
                        onSave={() => {
                            post(route('vendor.rows.store', table.id), {
                                onSuccess: () => {
                                    reset();
                                    setShowNewRowForm(false);
                                },
                            });
                        }}
                        onCancel={() => {
                            reset();
                            setShowNewRowForm(false);
                        }}
                    />
                )}

                {/* Edit Row Modal */}
                <EditModal
                    isOpen={editingRowId !== null}
                    title="Edit Row"
                    columns={columns}
                    editingData={editingData}
                    isLoading={updateForm.processing}
                    onUpdate={handleUpdateRow}
                    onCancel={() => {
                        setEditingRowId(null);
                        setEditingData({});
                        updateForm.reset();
                    }}
                />

                {/* Data Table */}
                <DataTable
                    rows={rows}
                    columns={columns}
                    editingRowId={editingRowId}
                    deletingRowId={deletingRowId}
                    onEditRow={handleEditRow}
                    onDeleteRow={handleDeleteRow}
                />

                {/* Row Counter */}
                <RowCounter count={rows.length} />
            </ContentContainer>
        </PageContainer>
    );
}
