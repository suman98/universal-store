import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/toast';
import { route } from '@/lib/route';

// Components
import AddRowButton from './components/AddRowButton';
import ContentContainer from './components/ContentContainer';
import DataTable from './components/DataTable';
import EditModal from './components/EditModal';
import NewRowModal from './components/NewRowModal';
import PageContainer from './components/PageContainer';
import PageHeader from './components/PageHeader';
import RowCounter from './components/RowCounter';
import AppLayout from '@/layouts/app-layout';
// Types & Utils
import type { Table, Column, Row } from './components/types';
import { getEditDataFromRow, transformFlatDataToNested } from './components/utils';

export default function Show() {
    const props = usePage().props as unknown as {
        table: Table;
        columns: Column[];
        rows: Row[];
        success?: string;
        error?: string;
    };
    
    const { table, columns, rows, success, error } = props;

    const [showNewRowForm, setShowNewRowForm] = useState(false);
    const [editingRowId, setEditingRowId] = useState<number | null>(null);
    const [editingData, setEditingData] = useState<Record<number, any>>({});
    const [deletingRowId, setDeletingRowId] = useState<number | null>(null);

    // Display flash messages
    useEffect(() => {
        if (success) {
            toast.success(success);
        }
    }, [success]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

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
                    toast.success('Row deleted successfully');
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
        router.put(route('vendor.rows.update', { tableId: table.id, id: editingRowId }), 
            { values: nestedData },
            {
                onSuccess: () => {
                    setEditingRowId(null);
                    setEditingData({});
                    toast.success('Row updated successfully');
                },
            }
        );
    };

    return (
        <AppLayout>
        <PageContainer>
            <Head title={table.display_name} />
            
            <PageHeader table={table} />

            <ContentContainer>
                {/* Add Row Button */}
                <AddRowButton onClick={() => setShowNewRowForm(true)} />

                {/* New Row Modal */}
                <NewRowModal
                    isOpen={showNewRowForm}
                    columns={columns}
                    formData={data.values}
                    isLoading={processing}
                    onFieldChange={handleAddRowFieldChange}
                    onSave={() => {
                        post(route('vendor.rows.store', table.id), {
                            onSuccess: () => {
                                reset();
                                setShowNewRowForm(false);
                                toast.success('Row created successfully');
                            },
                        });
                    }}
                    onCancel={() => {
                        reset();
                        setShowNewRowForm(false);
                    }}
                />

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
        </AppLayout>
    );
}
