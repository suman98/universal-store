import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { route } from '@/lib/route';

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
        post(route('vendor.tables.store'));
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <Head title="Create Table" />

            <div className="container mx-auto max-w-2xl px-4">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Create New Table</h1>
                    <p className="mt-1 text-gray-600">Define your table structure with fields</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Table Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Table Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className={`mt-1 block w-full rounded-lg border px-4 py-2 ${
                                errors.name ? 'border-red-500' : 'border-gray-300'
                            } focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                            placeholder="products"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
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
                            placeholder="Products"
                        />
                        {errors.display_name && <p className="mt-1 text-sm text-red-600">{errors.display_name}</p>}
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
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            rows={3}
                            placeholder="Describe your table..."
                        />
                    </div>

                    {/* Fields Section */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Define Fields</h2>

                        {/* Add Field Form */}
                        <div className="space-y-4 mb-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="field_name" className="block text-sm font-medium text-gray-700">
                                        Field Name
                                    </label>
                                    <input
                                        type="text"
                                        id="field_name"
                                        value={currentField.name}
                                        onChange={(e) => setCurrentField({ ...currentField, name: e.target.value })}
                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        placeholder="field_name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="field_display" className="block text-sm font-medium text-gray-700">
                                        Display Name
                                    </label>
                                    <input
                                        type="text"
                                        id="field_display"
                                        value={currentField.display_name}
                                        onChange={(e) =>
                                            setCurrentField({ ...currentField, display_name: e.target.value })
                                        }
                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        placeholder="Field Name"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="field_type" className="block text-sm font-medium text-gray-700">
                                        Field Type
                                    </label>
                                    <select
                                        id="field_type"
                                        value={currentField.type}
                                        onChange={(e) =>
                                            setCurrentField({ ...currentField, type: e.target.value as Field['type'] })
                                        }
                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
                                    <button
                                        type="button"
                                        onClick={addField}
                                        className="w-full rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 transition"
                                    >
                                        Add Field
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Fields List */}
                        {data.fields.length > 0 ? (
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-700">Added Fields</h3>
                                {data.fields.map((field, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{field.display_name}</p>
                                            <p className="text-xs text-gray-500">
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
                            <p className="text-center text-sm text-gray-500">No fields added yet</p>
                        )}

                        {errors.fields && <p className="mt-4 text-sm text-red-600">{errors.fields}</p>}
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={processing || data.fields.length === 0}
                            className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Creating...' : 'Create Table'}
                        </button>
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
