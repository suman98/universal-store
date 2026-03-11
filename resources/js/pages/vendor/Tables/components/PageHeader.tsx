import { Link } from '@inertiajs/react';
import { Settings, ArrowLeft } from 'lucide-react';
import { route } from '@/lib/route';
import { Button } from '@/components/ui/button';
import type { Table } from './types';

interface PageHeaderProps {
    table: Table;
}

export default function PageHeader({ table }: PageHeaderProps) {
    return (
        <div className="border-b border-border bg-background sticky top-0 z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">{table.display_name}</h1>
                        {table.description && (
                            <p className="mt-1 text-sm text-muted-foreground">{table.description}</p>
                        )}
                    </div>
                    <div className="ml-4 flex gap-2">
                        <Link href={route('vendor.tables.edit', table.id)}>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Settings className="w-4 h-4" />
                                Settings
                            </Button>
                        </Link>
                        <Link href={route('vendor.tables.index')}>
                            <Button variant="outline" size="sm" className="gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
