import { ReactNode } from 'react';

interface ContentContainerProps {
    children: ReactNode;
}

export default function ContentContainer({ children }: ContentContainerProps) {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
        </div>
    );
}
