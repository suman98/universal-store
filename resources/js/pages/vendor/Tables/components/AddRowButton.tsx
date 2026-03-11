import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AddRowButtonProps {
    onClick: () => void;
}

export default function AddRowButton({ onClick }: AddRowButtonProps) {
    return (
        <div className="mb-6">
            <Button onClick={onClick} size="lg" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Row
            </Button>
        </div>
    );
}
