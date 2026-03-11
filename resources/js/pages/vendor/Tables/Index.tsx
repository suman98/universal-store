import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/toast';
import AppLayout from '@/layouts/app-layout';
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
    const props = usePage().props as {
        tables: Table[];
        success?: string;
        error?: string;
    };
    
    const { tables, success, error } = props;
    const [localTables, setLocalTables] = useState<Table[]>(tables);

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

    useEffect(() => {
        setLocalTables(tables);
    }, [tables]);

    return (
        <AppLayout>
        <div className="min-h-screen bg-background">
            <Head title="Product Tables" />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Dynamic Tables</h1>
                        <p className="mt-1 text-muted-foreground">Manage your dynamic product tables</p>
                    </div>
                    <Link href={route('vendor.tables.create')}>
                        <Button>Create New Table</Button>
                    </Link>
                </div>

                {localTables.length === 0 ? (
                    <div className="rounded-lg border-2 border-dashed border-muted bg-muted/50 px-6 py-12 text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-muted-foreground"
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
                        <h3 className="mt-2 text-sm font-medium">No tables yet</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Get started by creating your first product table.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {localTables.map((table) => (
                            <Link
                                key={table.id}
                                href={route('vendor.tables.show', table.id)}
                                className="block transition-all hover:shadow-md"
                            >
                                <Card className="h-full cursor-pointer transition hover:border-primary/50">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle>{table.display_name}</CardTitle>
                                                <CardDescription>{table.name}</CardDescription>
                                            </div>
                                            <svg
                                                className="h-5 w-5 text-muted-foreground"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002 2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                                />
                                            </svg>
                                        </div>
                                        {table.description && (
                                            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                                                {table.description}
                                            </p>
                                        )}
                                    </CardHeader>
                                    <CardContent>
                                        <span className="text-xs text-muted-foreground">
                                            Created {new Date(table.created_at).toLocaleDateString()}
                                        </span>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
        </AppLayout>
    );
}
