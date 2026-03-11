import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { route } from '@/lib/route';
import { toast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Column {
    id: number;
    name: string;
    display_name: string;
    type: 'string' | 'number' | 'date' | 'boolean' | 'json' | 'text';
    position: number;
}

interface Table {
    id: number;
    name: string;
    display_name: string;
    description: string | null;
    columns: Column[];
}

export default function Edit() {
    const props = usePage().props as {
        table: Table;
        success?: string;
        error?: string;
    };
    
    const { table, success, error } = props;
    const { data, setData, put, errors, processing } = useForm({
        display_name: table.display_name,
        description: table.description || '',
        columns: table.columns,
    });

    const [editingColumnId, setEditingColumnId] = useState<number | null>(null);
    const [newColumn, setNewColumn] = useState({ display_name: '', type: 'string' });
    const [showNewColumnForm, setShowNewColumnForm] = useState(false);
    const [columnErrors, setColumnErrors] = useState<{ [key: number | string]: string }>({});

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

    const handleColumnEdit = (columnId: number, field: string, value: any) => {
        const cleanedValue = value.replace(/\s/g, '');
        
        // Validate display_name field
        if (field === 'display_name') {
            if (!cleanedValue.trim()) {
                setColumnErrors({ ...columnErrors, [columnId]: 'Field name cannot be empty or contain only spaces' });
                return;
            } else {
                const newErrors = { ...columnErrors };
                delete newErrors[columnId];
                setColumnErrors(newErrors);
            }
        }
        
        const updatedColumns = data.columns.map((col) =>
            col.id === columnId ? { ...col, [field]: cleanedValue } : col
        );
        setData('columns', updatedColumns);
    };

    const handleColumnDelete = (columnId: number) => {
        const updatedColumns = data.columns.filter((col) => col.id !== columnId);
        setData('columns', updatedColumns);
        toast.success('Column removed');
    };

    const handleAddColumn = () => {
        const cleanedName = newColumn.display_name.replace(/\s/g, '');
        
        if (!cleanedName.trim()) {
            setColumnErrors({ ...columnErrors, new: 'Field name cannot be empty or contain only spaces' });
            toast.error('Field name cannot be empty or contain only spaces');
            return;
        }

        const columnName = cleanedName
            .toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/[^a-z0-9_]/g, '');

        const newCol: Column = {
            id: Math.min(...data.columns.map((c) => c.id)) - 1, // Temporary ID for new columns
            name: columnName,
            display_name: cleanedName,
            type: newColumn.type as Column['type'],
            position: Math.max(...data.columns.map((c) => c.position), 0) + 1,
        };

        setData('columns', [...data.columns, newCol]);
        setNewColumn({ display_name: '', type: 'string' });
        setShowNewColumnForm(false);
        const newErrors = { ...columnErrors };
        delete newErrors['new'];
        setColumnErrors(newErrors);
        toast.success('Column added (will be created on save)');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Check if there are any column errors
        if (Object.keys(columnErrors).length > 0) {
            toast.error('Please fix all field name errors before saving');
            return;
        }
        
        // Validate all columns have valid names
        const hasInvalidColumns = data.columns.some(col => !col.display_name.trim());
        if (hasInvalidColumns) {
            toast.error('All columns must have valid names');
            return;
        }
        
        put(route('vendor.tables.update', table.id), {
            onSuccess: () => {
                toast.success('Table updated successfully');
                window.history.back();
            },
            onError: (errors: any) => {
                const errorMessages = Object.values(errors).flat();
                if (errorMessages.length > 0) {
                    toast.error(errorMessages[0] as string);
                } else {
                    toast.error('Error updating table');
                }
            },
        });
    };

    const columnTypeOptions = ['string', 'number', 'date', 'boolean', 'json', 'text'];

    return (
        <div className="min-h-screen bg-background py-8">
            <Head title={`Edit ${table.display_name}`} />

            <div className="container mx-auto max-w-2xl px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Edit Table</h1>
                    <p className="text-muted-foreground mt-1">Update table details</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Table Settings</CardTitle>
                        <CardDescription>Modify the table name, display name, and description</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Table Name (Read-only) */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Table Name</Label>
                            <Input
                                type="text"
                                id="name"
                                value={table.name}
                                readOnly
                                disabled
                            />
                            <p className="text-xs text-muted-foreground">Table name cannot be changed</p>
                        </div>

                        {/* Display Name */}
                        <div className="space-y-2">
                            <Label htmlFor="display_name">Display Name</Label>
                            <Input
                                type="text"
                                id="display_name"
                                value={data.display_name}
                                onChange={(e) => setData('display_name', e.target.value)}
                                aria-invalid={!!errors.display_name}
                            />
                            {errors.display_name && (
                                <p className="text-sm text-destructive">{errors.display_name}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex min-h-32 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive resize-none"
                                rows={4}
                                aria-invalid={!!errors.description}
                            />
                            {errors.description && (
                                <p className="text-sm text-destructive">{errors.description}</p>
                            )}
                        </div>

                        {/* Columns Management */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-semibold">Table Columns</h3>
                                    <p className="text-xs text-muted-foreground mt-1">Edit existing columns or add new ones</p>
                                </div>
                                {!showNewColumnForm && (
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={() => setShowNewColumnForm(true)}
                                    >
                                        Add Column
                                    </Button>
                                )}
                            </div>

                            {/* New Column Form */}
                            {showNewColumnForm && (
                                <div className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-4 space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <Label htmlFor="new_column_name" className="text-xs">Column Name</Label>
                                            <Input
                                                id="new_column_name"
                                                placeholder="e.g., ProductSKU"
                                                value={newColumn.display_name}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/\s/g, '');
                                                    setNewColumn({ ...newColumn, display_name: value });
                                                    
                                                    if (!value.trim()) {
                                                        setColumnErrors({ ...columnErrors, new: 'Field name cannot be empty or contain only spaces' });
                                                    } else {
                                                        const newErrors = { ...columnErrors };
                                                        delete newErrors['new'];
                                                        setColumnErrors(newErrors);
                                                    }
                                                }}
                                                aria-invalid={!!columnErrors['new']}
                                            />
                                            {columnErrors['new'] && (
                                                <p className="text-xs text-destructive">{columnErrors['new']}</p>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor="new_column_type" className="text-xs">Type</Label>
                                            <Select
                                                value={newColumn.type}
                                                onValueChange={(value) =>
                                                    setNewColumn({ ...newColumn, type: value })
                                                }
                                            >
                                                <SelectTrigger id="new_column_type">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {columnTypeOptions.map((type) => (
                                                        <SelectItem key={type} value={type}>
                                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            type="button"
                                            size="sm"
                                            onClick={handleAddColumn}
                                            disabled={!!columnErrors['new'] || !newColumn.display_name.trim()}
                                        >
                                            Create Column
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setShowNewColumnForm(false);
                                                setNewColumn({ display_name: '', type: 'string' });
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Columns List */}
                            <div className="space-y-2">
                                {data.columns.length === 0 ? (
                                    <p className="text-sm text-muted-foreground py-4 text-center">No columns yet. Add your first column.</p>
                                ) : (
                                    data.columns.map((column) => (
                                        <div
                                            key={column.id}
                                            className="rounded-lg border bg-card p-3 space-y-3"
                                        >
                                            <div className="grid grid-cols-3 gap-3">
                                                <div className="space-y-1">
                                                    <Label htmlFor={`col_name_${column.id}`} className="text-xs">Column Name</Label>
                                                    <Input
                                                        id={`col_name_${column.id}`}
                                                        value={column.display_name}
                                                        onChange={(e) => {
                                                            const value = e.target.value.replace(/\s/g, '');
                                                            handleColumnEdit(column.id, 'display_name', value);
                                                            
                                                            if (!value.trim()) {
                                                                setColumnErrors({ ...columnErrors, [column.id]: 'Field name cannot be empty or contain only spaces' });
                                                            } else {
                                                                const newErrors = { ...columnErrors };
                                                                delete newErrors[column.id];
                                                                setColumnErrors(newErrors);
                                                            }
                                                        }}
                                                        placeholder="DisplayName"
                                                        aria-invalid={!!columnErrors[column.id]}
                                                    />
                                                    {columnErrors[column.id] && (
                                                        <p className="text-xs text-destructive">{columnErrors[column.id]}</p>
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    <Label htmlFor={`col_type_${column.id}`} className="text-xs">Type</Label>
                                                    <Select
                                                        value={column.type}
                                                        onValueChange={(value) =>
                                                            handleColumnEdit(column.id, 'type', value)
                                                        }
                                                    >
                                                        <SelectTrigger id={`col_type_${column.id}`}>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {columnTypeOptions.map((type) => (
                                                                <SelectItem key={type} value={type}>
                                                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-xs">Field Name</Label>
                                                    <div className="flex items-center h-9 rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
                                                        {column.name}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleColumnDelete(column.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex gap-4 pt-6 border-t">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="flex-1"
                            >
                                {processing ? 'Saving...' : 'Save Changes'}
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="flex-1"
                            >
                                <Link href={route('vendor.tables.show', table.id)}>
                                    Cancel
                                </Link>
                            </Button>
                        </div>
                    </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
