import { Column } from './types';
import InputField from './InputField';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle2, X } from 'lucide-react';

interface NewRowFormProps {
    columns: Column[];
    formData: Record<number, Record<string, any>>;
    isLoading: boolean;
    onFieldChange: (columnId: number, value: any) => void;
    onSave: () => void;
    onCancel: () => void;
}

export default function NewRowForm({
    columns,
    formData,
    isLoading,
    onFieldChange,
    onSave,
    onCancel,
}: NewRowFormProps) {
    return (
        <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardHeader>
                <CardTitle>Add New Row</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

                <div className="flex gap-2 justify-end">
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        <X className="w-4 h-4" />
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
                                Save
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
