import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { route } from '@/lib/route';
import { toast } from '@/components/ui/toast';

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
    });

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
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

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <Head title={`Edit ${table.display_name}`} />

            <div className="container mx-auto max-w-2xl px-4">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Edit Table</h1>
                    <p className="mt-1 text-gray-600">Update table details</p>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Table Name (Read-only) */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Table Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={table.name}
                                readOnly
                                className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-500"
                            />
                            <p className="mt-1 text-xs text-gray-500">Table name cannot be changed</p>
                        </div>

                        {/* Display Name */}
                        <div>
                            <label htmlFor="display_name" className="block text-sm font-medium text-gray-700">
                                Display Name
                            </label>
                            <input
                                type="text"
                                id="display_name"
                                value={data.display_name}
                                onChange={(e) => setData('display_name', e.target.value)}
                                className={`mt-1 block w-full rounded-lg border px-4 py-2 ${
                                    errors.display_name ? 'border-red-500' : 'border-gray-300'
                                } focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                            />
                            {errors.display_name && (
                                <p className="mt-1 text-sm text-red-600">{errors.display_name}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className={`mt-1 block w-full rounded-lg border px-4 py-2 ${
                                    errors.description ? 'border-red-500' : 'border-gray-300'
                                } focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                                rows={4}
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                            )}
                        </div>

                        {/* Columns Info */}
                        <div className="rounded-lg bg-gray-50 p-4">
                            <h3 className="text-sm font-medium text-gray-900 mb-3">Table Columns</h3>
                            <div className="space-y-2">
                                {table.columns.map((column) => (
                                    <div key={column.id} className="flex items-center justify-between py-2">
                                        <div>
                                            <p className="font-medium text-gray-900">{column.display_name}</p>
                                            <p className="text-xs text-gray-500">
                                                {column.name} • {column.type}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex gap-4 pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                            <Link
                                href={route('vendor.tables.show', table.id)}
                                className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition text-center"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
