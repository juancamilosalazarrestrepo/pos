'use client';

import Sidebar from '@/components/Sidebar';
import { AuthProvider } from '@/components/AuthProvider';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <div className="flex min-h-screen">
                <Sidebar />
                <main className="flex-1 min-h-screen lg:pl-0">
                    <div className="p-4 pt-16 lg:p-8 lg:pt-8">{children}</div>
                </main>
            </div>
        </AuthProvider>
    );
}
