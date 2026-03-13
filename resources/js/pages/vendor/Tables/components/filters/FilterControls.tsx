import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Column } from '../types';
import NumberFilter from './NumberFilter';
import BooleanFilter from './BooleanFilter';
import DateFilter from './DateFilter';
import StringFilter from './StringFilter';
import { isFilterActive } from './filterUtils';

interface FilterControlsProps {
    columns: Column[];
    searchQuery: string;
    filters: Record<number, any>;
    onSearchChange: (query: string) => void;
    onFilterChange: (columnId: number, value: any) => void;
    onClearAll: () => void;
}

export default function FilterControls({
    columns,
    searchQuery,
    filters,
    onSearchChange,
    onFilterChange,
    onClearAll,
}: FilterControlsProps) {
    const hasActiveFilters = isFilterActive(filters);

    return (
        <div className="space-y-4 mb-6">
            {/* Search Bar */}
            <div className="relative">
                <svg
                    className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                </svg>
                <Input
                    placeholder="Search all columns..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-9"
                />
                {searchQuery && (
                    <button
                        onClick={() => onSearchChange('')}
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Column Filters */}
            <div className="flex items-center gap-2 flex-wrap">
                <Filter className="h-4 w-4 text-muted-foreground" />
                {columns.map(col => (
                    <div key={col.id} className="flex items-center gap-2">
                        {col.type === 'number' && (
                            <NumberFilter
                                columnId={col.id}
                                columnName={col.display_name}
                                filterValue={filters[col.id]}
                                onFilterChange={onFilterChange}
                            />
                        )}
                        {col.type === 'boolean' && (
                            <BooleanFilter
                                columnId={col.id}
                                columnName={col.display_name}
                                filterValue={filters[col.id]}
                                onFilterChange={onFilterChange}
                            />
                        )}
                        {col.type === 'date' && (
                            <DateFilter
                                columnId={col.id}
                                columnName={col.display_name}
                                filterValue={filters[col.id]}
                                onFilterChange={onFilterChange}
                            />
                        )}
                        {(col.type === 'string' || col.type === 'text') && (
                            <StringFilter
                                columnId={col.id}
                                columnName={col.display_name}
                                filterValue={filters[col.id]}
                                onFilterChange={onFilterChange}
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Clear All Button */}
            {(searchQuery || hasActiveFilters) && (
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={onClearAll}
                    className="text-destructive hover:text-destructive"
                >
                    Clear All
                </Button>
            )}
        </div>
    );
}
