import { ReactNode } from 'react';

interface PageContainerProps {
    children: ReactNode;
}

export default function PageContainer({ children }: PageContainerProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {children}
        </div>
    );
}
