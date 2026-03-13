import { Head, useForm, usePage, router } from '@inertiajs/react';
import { X, Search, Filter, ArrowUpDown } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
// Types & Utils
import type { Table, Column, Row } from './components/types';
import { getEditDataFromRow, transformFlatDataToNested } from './components/utils';

// Helper function to check if a value matches a filter based on column type
function matchesFilter(
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
                    const cellValue = row.cell_values?.find(cv => cv.column_id === col.id);
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

                const cellValue = row.cell_values?.find(cv => cv.column_id === columnId);
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
                                <div key={col.id} className="flex items-center gap-2">
                                    {col.type === 'number' && (
                                        <>
                                            <Select 
                                                value={filters[col.id]?.comparison || 'equals'}
                                                onValueChange={(val) => setFilters({
                                                    ...filters,
                                                    [col.id]: {
                                                        ...filters[col.id],
                                                        comparison: val
                                                    }
                                                })}
                                            >
                                                <SelectTrigger className="w-[100px]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="equals">Equals</SelectItem>
                                                    <SelectItem value="greater">&gt;</SelectItem>
                                                    <SelectItem value="less">&lt;</SelectItem>
                                                    <SelectItem value="greaterOrEqual">≥</SelectItem>
                                                    <SelectItem value="lessOrEqual">≤</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Input
                                                type="number"
                                                placeholder={`${col.display_name}`}
                                                value={filters[col.id]?.value || ''}
                                                onChange={(e) => setFilters({
                                                    ...filters,
                                                    [col.id]: {
                                                        ...filters[col.id],
                                                        value: e.target.value
                                                    }
                                                })}
                                                className="w-[120px]"
                                            />
                                        </>
                                    )}
                                    {col.type === 'boolean' && (
                                        <Select 
                                            value={filters[col.id] || ''}
                                            onValueChange={(val) => setFilters({
                                                ...filters,
                                                [col.id]: val
                                            })}
                                        >
                                            <SelectTrigger className="w-[140px]">
                                                <SelectValue placeholder={col.display_name} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">All</SelectItem>
                                                <SelectItem value="true">True</SelectItem>
                                                <SelectItem value="false">False</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                    {col.type === 'date' && (
                                        <>
                                            <Input
                                                type="date"
                                                placeholder="From"
                                                value={filters[col.id]?.startDate || ''}
                                                onChange={(e) => setFilters({
                                                    ...filters,
                                                    [col.id]: {
                                                        ...filters[col.id],
                                                        startDate: e.target.value
                                                    }
                                                })}
                                                className="w-[130px]"
                                            />
                                            <Input
                                                type="date"
                                                placeholder="To"
                                                value={filters[col.id]?.endDate || ''}
                                                onChange={(e) => setFilters({
                                                    ...filters,
                                                    [col.id]: {
                                                        ...filters[col.id],
                                                        endDate: e.target.value
                                                    }
                                                })}
                                                className="w-[130px]"
                                            />
                                        </>
                                    )}
                                    {(col.type === 'string' || col.type === 'text') && (
                                        <Input
                                            placeholder={`${col.display_name}`}
                                            value={filters[col.id] || ''}
                                            onChange={(e) => setFilters({
                                                ...filters,
                                                [col.id]: e.target.value
                                            })}
                                            className="w-[150px]"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Clear All Button */}
                        {(searchQuery || sortColumn || Object.values(filters).some(f => f !== undefined && f !== '' && f !== null)) && (
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
                {(searchQuery || sortColumn || Object.values(filters).some(f => f !== undefined && f !== '' && f !== null)) && (
                    <div className="mb-4 text-sm text-muted-foreground">
                        Showing {filteredAndSortedRows.length} of {rows.length} rows
                        {searchQuery && <span> (search)</span>}
                        {sortColumn && <span> (sorted)</span>}
                        {Object.values(filters).some(f => f !== undefined && f !== '' && f !== null) && <span> (filtered)</span>}
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
