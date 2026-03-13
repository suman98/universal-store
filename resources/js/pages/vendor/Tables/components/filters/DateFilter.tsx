import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronDown, X } from 'lucide-react';

interface DateFilterProps {
    columnId: number;
    columnName: string;
    filterValue: any;
    onFilterChange: (columnId: number, value: any) => void;
}

export default function DateFilter({
    columnId,
    columnName,
    filterValue,
    onFilterChange,
}: DateFilterProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const hasFilter = filterValue?.startDate || filterValue?.endDate;

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onFilterChange(columnId, null);
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: '2-digit',
        });
    };

    const getLabel = () => {
        if (!hasFilter) return 'Date Range';
        if (filterValue?.startDate && filterValue?.endDate) {
            return `${formatDate(filterValue.startDate)} → ${formatDate(filterValue.endDate)}`;
        }
        if (filterValue?.startDate) return `From ${formatDate(filterValue.startDate)}`;
        if (filterValue?.endDate) return `Until ${formatDate(filterValue.endDate)}`;
    };

    return (
        <div ref={containerRef} className="relative inline-block">

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className={`
                    flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium
                    border transition-all duration-150 whitespace-nowrap
                    ${hasFilter
                        ? `bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100
                           dark:bg-blue-950/60 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900/60`
                        : `bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300
                           dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700/70 dark:hover:border-gray-600`
                    }
                    ${isOpen
                        ? 'ring-2 ring-blue-100 border-blue-300 dark:ring-blue-900 dark:border-blue-600'
                        : ''
                    }
                `}
            >
                <Calendar
                    className={`w-3.5 h-3.5 
                        ${hasFilter
                            ? 'text-blue-500 dark:text-blue-400'
                            : 'text-gray-400 dark:text-gray-500'
                        }`}
                />
                <span className="max-w-[160px] truncate">{getLabel()}</span>
                {hasFilter ? (
                    <X
                        className="w-3 h-3 text-blue-400 hover:text-blue-600 ml-0.5
                                   dark:text-blue-500 dark:hover:text-blue-300"
                        onClick={handleClear}
                    />
                ) : (
                    <ChevronDown
                        className={`w-3 h-3 text-gray-400 dark:text-gray-500
                                    transition-transform duration-150 
                                    ${isOpen ? 'rotate-180' : ''}`}
                    />
                )}
            </button>

            {/* Floating Dropdown */}
            {isOpen && (
                <div
                    className="
                        absolute top-full left-0 mt-1.5 z-50 min-w-[240px]
                        bg-white dark:bg-gray-900
                        border border-gray-200 dark:border-gray-700/80
                        rounded-xl 
                        shadow-lg shadow-gray-200/80 dark:shadow-gray-950/80
                        p-3
                        animate-in fade-in slide-in-from-top-1 duration-150
                    "
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                        <span className="
                            text-xs font-semibold uppercase tracking-wide
                            text-gray-400 dark:text-gray-500
                        ">
                            Filter by Date
                        </span>
                        {hasFilter && (
                            <button
                                onClick={handleClear}
                                className="
                                    text-xs font-medium
                                    text-blue-500 hover:text-blue-700
                                    dark:text-blue-400 dark:hover:text-blue-300
                                    transition-colors
                                "
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Inputs */}
                    <div className="space-y-2">
                        <div>
                            <label className="
                                block text-xs font-medium mb-1
                                text-gray-400 dark:text-gray-500
                            ">
                                From
                            </label>
                            <Input
                                type="date"
                                value={filterValue?.startDate || ''}
                                max={filterValue?.endDate || ''}
                                onChange={(e) =>
                                    onFilterChange(columnId, {
                                        ...filterValue,
                                        startDate: e.target.value,
                                    })
                                }
                                className="
                                    h-8 text-xs rounded-lg
                                    border-gray-200 dark:border-gray-700
                                    bg-white dark:bg-gray-800
                                    text-gray-800 dark:text-gray-200
                                    focus:border-blue-300 focus:ring-blue-100
                                    dark:focus:border-blue-600 dark:focus:ring-blue-900/40
                                    dark:[color-scheme:dark]
                                "
                            />
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
                            <span className="text-[10px] font-medium text-gray-300 dark:text-gray-600">
                                TO
                            </span>
                            <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
                        </div>

                        <div>
                            <label className="
                                block text-xs font-medium mb-1
                                text-gray-400 dark:text-gray-500
                            ">
                                To
                            </label>
                            <Input
                                type="date"
                                value={filterValue?.endDate || ''}
                                min={filterValue?.startDate || ''}
                                onChange={(e) =>
                                    onFilterChange(columnId, {
                                        ...filterValue,
                                        endDate: e.target.value,
                                    })
                                }
                                className="
                                    h-8 text-xs rounded-lg
                                    border-gray-200 dark:border-gray-700
                                    bg-white dark:bg-gray-800
                                    text-gray-800 dark:text-gray-200
                                    focus:border-blue-300 focus:ring-blue-100
                                    dark:focus:border-blue-600 dark:focus:ring-blue-900/40
                                    dark:[color-scheme:dark]
                                "
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                        <Button
                            size="sm"
                            onClick={() => setIsOpen(false)}
                            className="
                                w-full h-7 text-xs rounded-lg
                                bg-blue-500 hover:bg-blue-600 text-white
                                dark:bg-blue-600 dark:hover:bg-blue-500
                                transition-colors
                            "
                        >
                            Apply
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
