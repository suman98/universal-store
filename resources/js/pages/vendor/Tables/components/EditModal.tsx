import { CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import InputField from './InputField';
import type { Column } from './types';

interface EditModalProps {
    isOpen: boolean;
    title: string;
    columns: Column[];
    editingData: Record<number, any>;
    isLoading: boolean;
    onUpdate: (data: Record<number, any>) => void;
    onCancel: () => void;
}

export default function EditModal({
    isOpen,
    title,
    columns,
    editingData,
    isLoading,
    onUpdate,
    onCancel,
}: EditModalProps) {
    const [localData, setLocalData] = useState<Record<number, any>>(editingData);

    // Sync localData when editingData prop changes
    useEffect(() => {
        setLocalData(editingData);
    }, [editingData]);

    const handleFieldChange = (columnId: number, value: any) => {
        const updated = { ...localData, [columnId]: value };
        setLocalData(updated);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onCancel}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6">
                    {columns.map((column) => (
                        <InputField
                            key={column.id}
                            column={column}
                            value={localData[column.id]}
                            onChange={(value) => handleFieldChange(column.id, value)}
                        />
                    ))}
                </div>

                <Separator />

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => onUpdate(localData)}
                        disabled={isLoading}
                        className="gap-2"
                    >
                        {isLoading ? (
                            <>
                                <span className="animate-spin">⏳</span>
                                Saving...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="w-4 h-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
