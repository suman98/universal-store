import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import InputField from './InputField';
import type { Column } from './types';

interface NewRowModalProps {
    isOpen: boolean;
    columns: Column[];
    formData: Record<number, Record<string, any>>;
    isLoading: boolean;
    onFieldChange: (columnId: number, value: any) => void;
    onSave: () => void;
    onCancel: () => void;
}

export default function NewRowModal({
    isOpen,
    columns,
    formData,
    isLoading,
    onFieldChange,
    onSave,
    onCancel,
}: NewRowModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onCancel}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Add New Row</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6">
                    {columns.map((column) => (
                        <InputField
                            key={column.id}
                            column={column}
                            value={formData[column.id]?.[`value_${column.type}`]}
                            onChange={(value) => onFieldChange(column.id, value)}
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
                        onClick={onSave}
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
                                Save Row
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
