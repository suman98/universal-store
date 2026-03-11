import { Head, useForm } from '@inertiajs/react';
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
    Sparkles
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/toast';
import AppLayout from '@/layouts/app-layout';
import { route } from '@/lib/route';
import SnakeCaseInput from './components/forms/SnakeInput';

interface Field {
    name: string;
    display_name: string;
    type: 'string' | 'number' | 'date' | 'boolean' | 'json' | 'text';
}

const FIELD_TYPES: { value: Field['type']; label: string; icon: React.ReactNode; color: string }[] = [
    { value: 'string',  label: 'Text',      icon: <Type      className="h-3.5 w-3.5" />, color: 'text-blue-500   bg-blue-500/10'   },
    { value: 'number',  label: 'Number',    icon: <Hash      className="h-3.5 w-3.5" />, color: 'text-purple-500 bg-purple-500/10' },
    { value: 'date',    label: 'Date',      icon: <Calendar  className="h-3.5 w-3.5" />, color: 'text-green-500  bg-green-500/10'  },
    { value: 'boolean', label: 'Boolean',   icon: <ToggleLeft className="h-3.5 w-3.5" />, color: 'text-orange-500 bg-orange-500/10' },
    { value: 'text',    label: 'Long Text', icon: <FileText  className="h-3.5 w-3.5" />, color: 'text-pink-500   bg-pink-500/10'   },
    { value: 'json',    label: 'JSON',      icon: <Braces    className="h-3.5 w-3.5" />, color: 'text-yellow-500 bg-yellow-500/10' },
];

function FieldTypeBadge({ type }: { type: Field['type'] }) {
    const config = FIELD_TYPES.find((t) => t.value === type)!;
    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${config.color}`}>
            {config.icon}
            {config.label}
        </span>
    );
}

export default function Create() {
    const { data, setData, post, errors, processing } = useForm({
        name: '',
        display_name: '',
        description: '',
        fields: [] as Field[],
    });

    const [currentField, setCurrentField] = useState<Field>({
        name: '',
        display_name: '',
        type: 'string',
    });

    const addField = () => {
        if (currentField.name && currentField.display_name) {
            setData('fields', [...data.fields, { ...currentField }]);
            setCurrentField({ name: '', display_name: '', type: 'string' });
        }
    };

    const removeField = (index: number) => {
        setData('fields', data.fields.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (data.fields.length === 0) {
            toast.error('Please add at least one field');
            return;
        }
        post(route('vendor.tables.store'), {
            onSuccess: () => toast.success('Table created successfully'),
            onError: (errors: any) => {
                const errorMessages = Object.values(errors).flat();
                toast.error(errorMessages.length > 0 ? (errorMessages[0] as string) : 'Error creating table');
            },
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addField();
        }
    };

    return (
        <AppLayout>
            <Head title="Create Table" />

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
                                <h1 className="text-2xl font-bold tracking-tight">Create New Table</h1>
                                <p className="text-sm text-muted-foreground">Define your table structure with custom fields</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* ── Main Content Grid ── */}
                        <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">

                            {/* ── Table Identity Card (Left - 2 cols) ── */}
                            <Card className="border-border/60 shadow-sm lg:col-span-2">
                                <CardHeader className="pb-3 pt-5 px-5">
                                    <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                        <Sparkles className="h-3.5 w-3.5" />
                                        Table Identity
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 px-5 pb-5">

                                    {/* Name */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="name" className="text-xs font-medium text-muted-foreground">
                                            Table Name <span className="text-red-500">*</span>
                                        </Label>
                                        <SnakeCaseInput
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="products"
                                            className={`h-9 text-sm font-mono ${errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                        />
                                        {errors.name && (
                                            <p className="text-xs text-red-500">{errors.name}</p>
                                        )}
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
                                    </div>
                                </CardContent>
                            </Card>

                            {/* ── Fields Card (Right - 3 cols) ── */}
                            <Card className="border-border/60 shadow-sm lg:col-span-3">
                                <CardHeader className="pb-3 pt-5 px-5">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                            <Table2 className="h-3.5 w-3.5" />
                                            Fields
                                        </CardTitle>
                                        {data.fields.length > 0 && (
                                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                                {data.fields.length} {data.fields.length === 1 ? 'field' : 'fields'}
                                            </span>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4 px-5 pb-5">

                                    {/* ── Add Field Row ── */}
                                    <div className="rounded-lg border border-dashed border-border/80 bg-muted/30 p-4">
                                        <p className="mb-3 text-xs font-medium text-muted-foreground">New Field</p>

                                        <div className="space-y-3">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1.5">
                                                    <Label htmlFor="field_name" className="text-xs text-muted-foreground">Field Name</Label>
                                                    <SnakeCaseInput
                                                        id="field_name"
                                                        value={currentField.name}
                                                        onChange={(e: { target: { value: any; }; }) => setCurrentField({ ...currentField, name: e.target.value })}
                                                        onKeyDown={handleKeyDown}
                                                        placeholder="field_name"
                                                        className="h-8 font-mono text-xs"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label htmlFor="field_display" className="text-xs text-muted-foreground">Display Name</Label>
                                                    <Input
                                                        id="field_display"
                                                        value={currentField.display_name}
                                                        onChange={(e) => setCurrentField({ ...currentField, display_name: e.target.value })}
                                                        onKeyDown={handleKeyDown}
                                                        placeholder="Field Name"
                                                        className="h-8 text-xs"
                                                    />
                                                </div>
                                            </div>

                                            {/* ── Type Pills ── */}
                                            <div className="space-y-1.5">
                                                <Label className="text-xs text-muted-foreground">Type</Label>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {FIELD_TYPES.map((ft) => (
                                                        <button
                                                            key={ft.value}
                                                            type="button"
                                                            onClick={() => setCurrentField({ ...currentField, type: ft.value })}
                                                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all ${
                                                                currentField.type === ft.value
                                                                    ? `${ft.color} border-transparent ring-2 ring-offset-1 ring-offset-background ring-current/30`
                                                                    : 'border-border bg-background text-muted-foreground hover:border-border/80 hover:text-foreground'
                                                            }`}
                                                        >
                                                            {ft.icon}
                                                            {ft.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <Button
                                                type="button"
                                                size="sm"
                                                onClick={addField}
                                                disabled={!currentField.name || !currentField.display_name}
                                                className="h-8 w-full gap-1.5 text-xs"
                                            >
                                                <Plus className="h-3.5 w-3.5" />
                                                Add Field
                                            </Button>
                                        </div>
                                    </div>

                                    {/* ── Fields List ── */}
                                    <div className="max-h-[400px] space-y-1.5 overflow-y-auto pr-2">
                                        {data.fields.length > 0 ? (
                                            data.fields.map((field, index) => (
                                                <div
                                                    key={index}
                                                    className="group flex items-center gap-3 rounded-lg border border-border/60 bg-background px-3 py-2.5 transition-colors hover:border-border hover:bg-muted/30"
                                                >
                                                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-mono font-medium text-muted-foreground">
                                                        {index + 1}
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-medium">{field.display_name}</span>
                                                            <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/40" />
                                                            <span className="truncate font-mono text-xs text-muted-foreground">{field.name}</span>
                                                        </div>
                                                    </div>

                                                    <FieldTypeBadge type={field.type} />

                                                    <button
                                                        type="button"
                                                        onClick={() => removeField(index)}
                                                        className="ml-1 shrink-0 rounded-md p-1 text-muted-foreground/40 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-500 group-hover:opacity-100"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/60 py-6 text-center">
                                                <Table2 className="mb-2 h-8 w-8 text-muted-foreground/30" />
                                                <p className="text-sm font-medium text-muted-foreground">No fields yet</p>
                                                <p className="mt-0.5 text-xs text-muted-foreground/60">Add your first field above</p>
                                            </div>
                                        )}
                                    </div>

                                    {errors.fields && (
                                        <p className="text-xs text-red-500">{errors.fields}</p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* ── Actions ── */}
                        <div className="flex gap-3 justify-end">
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
                                disabled={processing || data.fields.length === 0}
                                className="h-9 gap-1.5 text-sm"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        Creating…
                                    </>
                                ) : (
                                    <>
                                        <Plus className="h-3.5 w-3.5" />
                                        Create Table
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
