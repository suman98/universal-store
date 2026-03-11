import { FileText } from 'lucide-react';

export default function EmptyState() {
    return (
        <div className="p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-foreground font-medium">No data yet</p>
            <p className="text-sm text-muted-foreground mt-1">Add your first row to get started</p>
        </div>
    );
}
