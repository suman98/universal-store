import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { route } from '@/lib/route';
import { toast } from '@/components/ui/toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Field {
    name: string;
    display_name: string;
    type: 'string' | 'number' | 'date' | 'boolean' | 'json' | 'text';
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
        setData(
            'fields',
            data.fields.filter((_, i) => i !== index)
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Show validation error if no fields added
        if (data.fields.length === 0) {
            toast.error('Please add at least one field');
            return;
        }
        
        post(route('vendor.tables.store'), {
            onError: (errors: any) => {
                // Show first error as toast
                const errorMessages = Object.values(errors).flat();
                if (errorMessages.length > 0) {
                    toast.error(errorMessages[0] as string);
                } else {
                    toast.error('Error creating table');
                }
            },
        });
    };

    return (
        <div className="min-h-screen bg-background">
            <Head title="Create Table" />

            <div className="container mx-auto max-w-2xl px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">Create New Table</h1>
                    <p className="mt-1 text-muted-foreground">Define your table structure with fields</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Table Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Table Name</Label>
                        <Input
                            type="text"
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className={errors.name ? 'border-red-500' : ''}
                            placeholder="products"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>

                    {/* Display Name */}
                    <div className="space-y-2">
                        <Label htmlFor="display_name">Display Name</Label>
                        <Input
                            type="text"
                            id="display_name"
                            value={data.display_name}
                            onChange={(e) => setData('display_name', e.target.value)}
                            className={errors.display_name ? 'border-red-500' : ''}
                            placeholder="Products"
                        />
                        {errors.display_name && <p className="mt-1 text-sm text-red-600">{errors.display_name}</p>}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            rows={3}
                            placeholder="Describe your table..."
                        />
                    </div>

                    {/* Fields Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Define Fields</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">

                        {/* Add Field Form */}
                        <div className="space-y-4 mb-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="field_name">Field Name</Label>
                                    <Input
                                        type="text"
                                        id="field_name"
                                        value={currentField.name}
                                        onChange={(e) => setCurrentField({ ...currentField, name: e.target.value })}
                                        placeholder="field_name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="field_display">Display Name</Label>
                                    <Input
                                        type="text"
                                        id="field_display"
                                        value={currentField.display_name}
                                        onChange={(e) =>
                                            setCurrentField({ ...currentField, display_name: e.target.value })
                                        }
                                        placeholder="Field Name"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="field_type">Field Type</Label>
                                    <select
                                        id="field_type"
                                        value={currentField.type}
                                        onChange={(e) =>
                                            setCurrentField({ ...currentField, type: e.target.value as Field['type'] })
                                        }
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="string">Text</option>
                                        <option value="number">Number</option>
                                        <option value="date">Date</option>
                                        <option value="boolean">Boolean</option>
                                        <option value="text">Long Text</option>
                                        <option value="json">JSON</option>
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <Button
                                        type="button"
                                        onClick={addField}
                                        className="w-full"
                                    >
                                        Add Field
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Fields List */}
                        {data.fields.length > 0 ? (
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium">Added Fields</h3>
                                {data.fields.map((field, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between rounded-lg bg-muted p-3"
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium">{field.display_name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {field.name} • {field.type}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeField(index)}
                                            className="ml-4 text-red-600 hover:text-red-900"
                                        >
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-sm text-muted-foreground">No fields added yet</p>
                        )}

                        {errors.fields && <p className="mt-4 text-sm text-red-600">{errors.fields}</p>}
                        </CardContent>
                    </Card>

                    {/* Form Actions */}
                    <div className="flex gap-4">
                        <Button
                            type="submit"
                            disabled={processing || data.fields.length === 0}
                            className="flex-1"
                        >
                            {processing ? 'Creating...' : 'Create Table'}
                        </Button>
                        <Button
                            type="button"
                            onClick={() => window.history.back()}
                            variant="outline"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
