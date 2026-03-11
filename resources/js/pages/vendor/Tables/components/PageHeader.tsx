import { Link } from '@inertiajs/react';
import { Table } from './types';
import { route } from '@/lib/route';
import { Settings, ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
    table: Table;
}

export default function PageHeader({ table }: PageHeaderProps) {
    return (
        <div className="border-b border-gray-200 bg-white shadow-sm sticky top-0 z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900">{table.display_name}</h1>
                        {table.description && (
                            <p className="mt-1 text-sm text-gray-600">{table.description}</p>
                        )}
                    </div>
                    <div className="ml-4 flex gap-2">
                        <Link
                            href={route('vendor.tables.edit', table.id)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-input bg-background text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition"
                        >
                            <Settings className="w-4 h-4" />
                            Settings
                        </Link>
                        <Link
                            href={route('vendor.tables.index')}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-input bg-background text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
