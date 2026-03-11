import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { route } from '@/lib/route';

interface Table {
    id: number;
    name: string;
    display_name: string;
    description: string | null;
    created_at: string;
    org_id: number;
}

export default function Index() {
    const { tables } = usePage().props as { tables: Table[] };
    const [localTables, setLocalTables] = useState<Table[]>(tables);

    useEffect(() => {
        setLocalTables(tables);
    }, [tables]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Product Tables" />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Product Tables</h1>
                        <p className="mt-1 text-gray-600">Manage your dynamic product tables</p>
                    </div>
                    <Link
                        href={route('vendor.tables.create')}
                        className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700 transition"
                    >
                        Create New Table
                    </Link>
                </div>

                {localTables.length === 0 ? (
                    <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No tables yet</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating your first product table.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {localTables.map((table) => (
                            <Link
                                key={table.id}
                                href={route('vendor.tables.show', table.id)}
                                className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-blue-300"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                                            {table.display_name}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">{table.name}</p>
                                        {table.description && (
                                            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                                                {table.description}
                                            </p>
                                        )}
                                    </div>
                                    <svg
                                        className="h-5 w-5 text-gray-400 group-hover:text-blue-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        />
                                    </svg>
                                </div>
                                <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100">
                                    <span className="text-xs text-gray-500">
                                        Created {new Date(table.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
