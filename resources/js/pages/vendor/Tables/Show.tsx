import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState, useEffect, useMemo } from 'react';
import { toast } from '@/components/ui/toast';
import { route } from '@/lib/route';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';
import { X, Search, Filter, ArrowUpDown } from 'lucide-react';

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

    // Search, Sort, and Filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [sortColumn, setSortColumn] = useState<number | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [filters, setFilters] = useState<Record<number, string>>({});

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
        let filtered = rows.filter(row => {
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesSearch = columns.some(col => {
                    const cellValue = row.cell_values?.find(cv => cv.column_id === col.id);
                    const value = cellValue?.[`value_${col.type}`] ?? '';
                    return String(value).toLowerCase().includes(query);
                });
                if (!matchesSearch) return false;
            }

            // Column filters
            const matchesFilters = Object.entries(filters).every(([colId, filterValue]) => {
                if (!filterValue) return true;
                const columnId = Number(colId);
                const cellValue = row.cell_values?.find(cv => cv.column_id === columnId);
                const value = cellValue?.[`value_${columns.find(c => c.id === columnId)?.type}`] ?? '';
                return String(value).toLowerCase().includes(filterValue.toLowerCase());
            });
            
            return matchesFilters;
        });

        // Sort rows
        if (sortColumn !== null) {
            const column = columns.find(c => c.id === sortColumn);
            if (column) {
                filtered.sort((a, b) => {
                    const aCell = a.cell_values?.find(cv => cv.column_id === sortColumn);
                    const bCell = b.cell_values?.find(cv => cv.column_id === sortColumn);
                    
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

                {/* Search, Filter, Sort Controls */}
                <div className="space-y-4 mb-6">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search all columns..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* Sort and Filter Controls */}
                    <div className="flex gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                            <Select 
                                value={sortColumn?.toString() || 'none'}
                                onValueChange={(val) => setSortColumn(val !== 'none' ? Number(val) : null)}
                            >
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Sort by..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {columns.map(col => (
                                        <SelectItem key={col.id} value={col.id.toString()}>
                                            {col.display_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {sortColumn !== null && (
                                <>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                                        className="gap-1"
                                    >
                                        {sortDirection === 'asc' ? '↑ Asc' : '↓ Desc'}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setSortColumn(null)}
                                        className="text-destructive hover:text-destructive"
                                    >
                                        Clear Sort
                                    </Button>
                                </>
                            )}
                        </div>

                        {/* Column Filters */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            {columns.map(col => (
                                <Input
                                    key={col.id}
                                    placeholder={`Filter ${col.display_name}...`}
                                    value={filters[col.id] || ''}
                                    onChange={(e) => setFilters({
                                        ...filters,
                                        [col.id]: e.target.value
                                    })}
                                    className="w-[150px]"
                                />
                            ))}
                        </div>

                        {/* Clear All Button */}
                        {(searchQuery || sortColumn || Object.values(filters).some(f => f)) && (
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                    setSearchQuery('');
                                    setSortColumn(null);
                                    setFilters({});
                                }}
                                className="text-destructive hover:text-destructive"
                            >
                                Clear All
                            </Button>
                        )}
                    </div>
                </div>

                {/* Results Info */}
                {(searchQuery || sortColumn || Object.values(filters).some(f => f)) && (
                    <div className="mb-4 text-sm text-muted-foreground">
                        Showing {filteredAndSortedRows.length} of {rows.length} rows
                        {searchQuery && <span> (search)</span>}
                        {sortColumn && <span> (sorted)</span>}
                        {Object.values(filters).some(f => f) && <span> (filtered)</span>}
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
