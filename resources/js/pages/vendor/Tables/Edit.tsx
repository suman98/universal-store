import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    Plus,
    Trash2,
    Table2,
    ChevronRight,
    Hash,
    Type,
    Calendar,
    ToggleLeft,
    FileText,
    Braces,
    ArrowLeft,
    Loader2,
    Sparkles,
    Lock,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SnakeCaseInput from './components/forms/SnakeInput';
import { toast } from '@/components/ui/toast';
import AppLayout from '@/layouts/app-layout';
import { route } from '@/lib/route';

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

const FIELD_TYPES: { value: Column['type']; label: string; icon: React.ReactNode; color: string }[] = [
    { value: 'string',  label: 'Text',      icon: <Type      className="h-3.5 w-3.5" />, color: 'text-blue-500   bg-blue-500/10'   },
    { value: 'number',  label: 'Number',    icon: <Hash      className="h-3.5 w-3.5" />, color: 'text-purple-500 bg-purple-500/10' },
    { value: 'date',    label: 'Date',      icon: <Calendar  className="h-3.5 w-3.5" />, color: 'text-green-500  bg-green-500/10'  },
    { value: 'boolean', label: 'Boolean',   icon: <ToggleLeft className="h-3.5 w-3.5" />, color: 'text-orange-500 bg-orange-500/10' },
    { value: 'text',    label: 'Long Text', icon: <FileText  className="h-3.5 w-3.5" />, color: 'text-pink-500   bg-pink-500/10'   },
    { value: 'json',    label: 'JSON',      icon: <Braces    className="h-3.5 w-3.5" />, color: 'text-yellow-500 bg-yellow-500/10' },
];

function FieldTypeBadge({ type }: { type: Column['type'] }) {
    const config = FIELD_TYPES.find((t) => t.value === type)!;
    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${config.color}`}>
            {config.icon}
            {config.label}
        </span>
    );
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
        const cleanedValue = field === 'display_name' ? value.replace(/\s/g, '') : value;
        
        // Validate display_name field
        if (field === 'display_name') {
            if (!cleanedValue.trim()) {
                setColumnErrors({ ...columnErrors, [columnId]: 'Field name cannot be empty' });
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
            setColumnErrors({ ...columnErrors, new: 'Field name cannot be empty' });
            toast.error('Field name cannot be empty');
            return;
        }

        const columnName = cleanedName
            .toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/[^a-z0-9_]/g, '');

        const newCol: Column = {
            id: Math.min(...data.columns.map((c) => c.id)) - 1,
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
        toast.success('Column added');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (Object.keys(columnErrors).length > 0) {
            toast.error('Please fix all field name errors before saving');
            return;
        }
        
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

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddColumn();
        }
    };

    return (
        <AppLayout>
            <Head title={`Edit ${table.display_name}`} />

            <div className="min-h-screen bg-background">
                <div className="w-full px-4 py-8">

                    {/* ── Header ── */}
                    <div className="mb-8">
                        <button
                            onClick={() => window.history.back()}
                            className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Back
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                                <Table2 className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">Edit Table</h1>
                                <p className="text-sm text-muted-foreground">Update table settings and columns</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* ── Main Content Grid ── */}
                        <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">

                            {/* ── Table Settings Card (Left - 2 cols) ── */}
                            <Card className="border-border/60 shadow-sm lg:col-span-2">
                                <CardHeader className="pb-3 pt-5 px-5">
                                    <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                        <Sparkles className="h-3.5 w-3.5" />
                                        Settings
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 px-5 pb-5">

                                    {/* Table Name (Read-only) */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="name" className="text-xs font-medium text-muted-foreground">
                                            Table Name
                                        </Label>
                                        <div className="flex h-9 items-center gap-2 rounded-md border border-input bg-muted px-3 py-2 text-sm font-mono text-muted-foreground">
                                            <Lock className="h-3.5 w-3.5 shrink-0" />
                                            {table.name}
                                        </div>
                                        <p className="text-xs text-muted-foreground/80">Cannot be changed</p>
                                    </div>

                                    {/* Display Name */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="display_name" className="text-xs font-medium text-muted-foreground">
                                            Display Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="display_name"
                                            value={data.display_name}
                                            onChange={(e) => setData('display_name', e.target.value)}
                                            placeholder="Products"
                                            className={`h-9 text-sm ${errors.display_name ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                        />
                                        {errors.display_name && (
                                            <p className="text-xs text-red-500">{errors.display_name}</p>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="description" className="text-xs font-medium text-muted-foreground">
                                            Description
                                        </Label>
                                        <textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            rows={3}
                                            placeholder="Describe what this table stores..."
                                            className="flex w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                        {errors.description && (
                                            <p className="text-xs text-red-500">{errors.description}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* ── Columns Management Card (Right - 3 cols) ── */}
                            <Card className="border-border/60 shadow-sm lg:col-span-3">
                                <CardHeader className="pb-3 pt-5 px-5">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                            <Table2 className="h-3.5 w-3.5" />
                                            Columns
                                        </CardTitle>
                                        {data.columns.length > 0 && (
                                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                                {data.columns.length} {data.columns.length === 1 ? 'column' : 'columns'}
                                            </span>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4 px-5 pb-5">

                                    {/* ── Add Column Form ── */}
                                    {!showNewColumnForm ? (
                                        <Button
                                            type="button"
                                            size="sm"
                                            onClick={() => setShowNewColumnForm(true)}
                                            className="w-full gap-1.5 text-xs h-8"
                                        >
                                            <Plus className="h-3.5 w-3.5" />
                                            Add Column
                                        </Button>
                                    ) : (
                                        <div className="rounded-lg border border-dashed border-border/80 bg-muted/30 p-4">
                                            <p className="mb-3 text-xs font-medium text-muted-foreground">New Column</p>

                                            <div className="space-y-3">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="space-y-1.5">
                                                        <Label htmlFor="new_column_name" className="text-xs text-muted-foreground">
                                                            Column Name
                                                        </Label>
                                                        <Input
                                                            id="new_column_name"
                                                            placeholder="e.g., ProductSKU"
                                                            value={newColumn.display_name}
                                                            onChange={(e) => {
                                                                const value = e.target.value.replace(/\s/g, '');
                                                                setNewColumn({ ...newColumn, display_name: value });
                                                                
                                                                if (!value.trim()) {
                                                                    setColumnErrors({ ...columnErrors, new: 'Field name cannot be empty' });
                                                                } else {
                                                                    const newErrors = { ...columnErrors };
                                                                    delete newErrors['new'];
                                                                    setColumnErrors(newErrors);
                                                                }
                                                            }}
                                                            onKeyDown={handleKeyDown}
                                                            className={`h-8 text-xs ${columnErrors['new'] ? 'border-red-500' : ''}`}
                                                        />
                                                        {columnErrors['new'] && (
                                                            <p className="text-xs text-red-500">{columnErrors['new']}</p>
                                                        )}
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label className="text-xs text-muted-foreground">Type</Label>
                                                        <div className="flex flex-wrap gap-1">
                                                            {FIELD_TYPES.map((ft) => (
                                                                <button
                                                                    key={ft.value}
                                                                    type="button"
                                                                    onClick={() => setNewColumn({ ...newColumn, type: ft.value })}
                                                                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-all ${
                                                                        newColumn.type === ft.value
                                                                            ? `${ft.color} border-transparent ring-2 ring-offset-1 ring-offset-background ring-current/30`
                                                                            : 'border-border bg-background text-muted-foreground hover:border-border/80'
                                                                    }`}
                                                                >
                                                                    {ft.icon}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 pt-2">
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        onClick={handleAddColumn}
                                                        disabled={!!columnErrors['new'] || !newColumn.display_name.trim()}
                                                        className="h-8 gap-1.5 text-xs flex-1"
                                                    >
                                                        <Plus className="h-3.5 w-3.5" />
                                                        Create
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => {
                                                            setShowNewColumnForm(false);
                                                            setNewColumn({ display_name: '', type: 'string' });
                                                            const newErrors = { ...columnErrors };
                                                            delete newErrors['new'];
                                                            setColumnErrors(newErrors);
                                                        }}
                                                        className="h-8 text-xs flex-1"
                                                    >
                                                        <X className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* ── Columns List ── */}
                                    <div className="max-h-[500px] space-y-1.5 overflow-y-auto pr-2">
                                        {data.columns.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/60 py-8 text-center">
                                                <Table2 className="mb-2 h-8 w-8 text-muted-foreground/30" />
                                                <p className="text-sm font-medium text-muted-foreground">No columns yet</p>
                                                <p className="mt-0.5 text-xs text-muted-foreground/60">Add your first column</p>
                                            </div>
                                        ) : (
                                            data.columns.map((column, index) => (
                                                <div
                                                    key={column.id}
                                                    className="group rounded-lg border border-border/60 bg-background p-3 transition-colors hover:border-border hover:bg-muted/30"
                                                >
                                                    {/* Column Header */}
                                                    <div className="mb-3 flex items-center gap-2">
                                                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-mono font-medium text-muted-foreground">
                                                            {index + 1}
                                                        </div>
                                                        <FieldTypeBadge type={column.type} />
                                                        <div className="flex-1 min-w-0 truncate text-xs font-mono text-muted-foreground">
                                                            {column.name}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleColumnDelete(column.id)}
                                                            className="shrink-0 rounded-md p-1 text-muted-foreground/40 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-500 group-hover:opacity-100"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>

                                                    {/* Column Edit Row */}
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="space-y-1">
                                                            <Label htmlFor={`col_name_${column.id}`} className="text-xs text-muted-foreground">
                                                                Display Name
                                                            </Label>
                                                            <Input
                                                                id={`col_name_${column.id}`}
                                                                value={column.display_name}
                                                                onChange={(e) => {
                                                                    const value = e.target.value.replace(/\s/g, '');
                                                                    handleColumnEdit(column.id, 'display_name', value);
                                                                    
                                                                    if (!value.trim()) {
                                                                        setColumnErrors({ ...columnErrors, [column.id]: 'Field name cannot be empty' });
                                                                    } else {
                                                                        const newErrors = { ...columnErrors };
                                                                        delete newErrors[column.id];
                                                                        setColumnErrors(newErrors);
                                                                    }
                                                                }}
                                                                placeholder="DisplayName"
                                                                className={`h-8 text-xs ${columnErrors[column.id] ? 'border-red-500' : ''}`}
                                                            />
                                                            {columnErrors[column.id] && (
                                                                <p className="text-xs text-red-500">{columnErrors[column.id]}</p>
                                                            )}
                                                        </div>

                                                        <div className="space-y-1">
                                                            <Label className="text-xs text-muted-foreground">Type</Label>
                                                            <div className="flex flex-wrap gap-1">
                                                                {FIELD_TYPES.map((ft) => (
                                                                    <button
                                                                        key={ft.value}
                                                                        type="button"
                                                                        onClick={() => handleColumnEdit(column.id, 'type', ft.value)}
                                                                        className={`inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-xs transition-all ${
                                                                            column.type === ft.value
                                                                                ? `${ft.color} border-transparent ring-2 ring-offset-1 ring-offset-background ring-current/30`
                                                                                : 'border-border bg-background text-muted-foreground hover:border-border/80'
                                                                        }`}
                                                                    >
                                                                        {ft.icon}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* ── Form Actions ── */}
                        <div className="flex gap-3 border-t pt-5 justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.history.back()}
                                className="h-9 gap-1.5 text-sm"
                            >
                                <ArrowLeft className="h-3.5 w-3.5" />
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing || data.columns.length === 0}
                                className="h-9 gap-1.5 text-sm"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        Saving…
                                    </>
                                ) : (
                                    <>
                                        <Table2 className="h-3.5 w-3.5" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>

                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

