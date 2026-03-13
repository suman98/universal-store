import { Head, useForm, usePage, router } from '@inertiajs/react';
import { ArrowUpDown } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';
import { toast } from '@/components/ui/toast';
import AppLayout from '@/layouts/app-layout';
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
import { FilterControls, matchesFilter, isFilterActive } from './components/filters';

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

    // Search, Sort, and Filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [sortColumn, setSortColumn] = useState<number | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [filters, setFilters] = useState<Record<number, any>>({});

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

    // Filter and sort rows
    const filteredAndSortedRows = useMemo(() => {
        const filtered = rows.filter(row => {

            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesSearch = columns.some(col => {
                    const cellValue = row.values?.find(cv => cv.column_id === col.id);
                    const value = cellValue?.[`value_${col.type}`] ?? '';
                    return String(value).toLowerCase().includes(query);
                });
                if (!matchesSearch) return false;
            }

            // Column filters
            const matchesFilters = Object.entries(filters).every(([colId, filterValue]) => {
                const columnId = Number(colId);
                const column = columns.find(c => c.id === columnId);
                if (!column) return true;

                const cellValue = row.values?.find(cv => cv.column_id === columnId);
                const value = cellValue?.[`value_${column.type}`] ?? '';

                return matchesFilter(value, filterValue, column.type);
            });
            
            return matchesFilters;
        });

        // Sort rows
        if (sortColumn !== null) {
            const column = columns.find(c => c.id === sortColumn);
            if (column) {
                filtered.sort((a, b) => {
                    const aCell = a.values?.find(cv => cv.column_id === sortColumn);
                    const bCell = b.values?.find(cv => cv.column_id === sortColumn);
                    
                    const aValue = aCell?.[`value_${column.type}`] ?? '';
                    const bValue = bCell?.[`value_${column.type}`] ?? '';

                    let comparison = 0;
                    if (column.type === 'number') {
                        comparison = (Number(aValue) || 0) - (Number(bValue) || 0);
                    } else {
                        comparison = String(aValue).localeCompare(String(bValue));
                    }

                    return sortDirection === 'asc' ? comparison : -comparison;
                });
            }
        }

        return filtered;
    }, [rows, columns, searchQuery, sortColumn, sortDirection, filters]);

    const handleSort = (columnId: number) => {
        if (sortColumn === columnId) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(columnId);
            setSortDirection('asc');
        }
    };

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

                {/* Filter Controls */}
                <FilterControls
                    columns={columns}
                    searchQuery={searchQuery}
                    filters={filters}
                    onSearchChange={setSearchQuery}
                    onFilterChange={(colId, value) => setFilters({
                        ...filters,
                        [colId]: value
                    })}
                    onClearAll={() => {
                        setSearchQuery('');
                        setSortColumn(null);
                        setFilters({});
                    }}
                />

                {/* Results Info */}
                {(searchQuery || sortColumn || isFilterActive(filters)) && (
                    <div className="mb-4 text-sm text-muted-foreground">
                        Showing {filteredAndSortedRows.length} of {rows.length} rows
                        {searchQuery && <span> (search)</span>}
                        {sortColumn && <span> (sorted)</span>}
                        {isFilterActive(filters) && <span> (filtered)</span>}
                    </div>
                )}

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
                    rows={filteredAndSortedRows}
                    columns={columns}
                    editingRowId={editingRowId}
                    deletingRowId={deletingRowId}
                    onEditRow={handleEditRow}
                    onDeleteRow={handleDeleteRow}
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                />

                {/* Row Counter */}
                <RowCounter count={filteredAndSortedRows.length} />
            </ContentContainer>
        </PageContainer>
        </AppLayout>
    );
}
