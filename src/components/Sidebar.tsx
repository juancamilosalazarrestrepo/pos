'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Menu,
    X,
    Store,
    Settings,
    LogOut,
    Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from './AuthProvider';

const allNavItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin'] },
    { href: '/inventario', label: 'Inventario', icon: Package, roles: ['admin', 'inventario'] },
    { href: '/pos', label: 'Terminal POS', icon: ShoppingCart, roles: ['admin', 'cajero'] },
    { href: '/usuarios', label: 'Usuarios', icon: Users, roles: ['admin'] },
];

const rolLabels: Record<string, { label: string; color: string }> = {
    admin: { label: 'Administrador', color: 'text-primary-400' },
    cajero: { label: 'Cajero', color: 'text-emerald-400' },
    inventario: { label: 'Inventario', color: 'text-amber-400' },
};

export default function Sidebar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const { perfil, signOut, loading } = useAuth();

    const userRole = perfil?.rol || 'cajero';
    const navItems = allNavItems.filter((item) => item.roles.includes(userRole));

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    const rolInfo = rolLabels[userRole] || rolLabels.cajero;

    const navContent = (
        <>
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 py-6 border-b border-surface-800">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-600 shadow-lg shadow-primary-600/30">
                    <Store size={22} className="text-white" />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-white tracking-tight">MiPOS</h1>
                    <p className="text-xs text-surface-400">Sistema de Ventas</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                <p className="px-3 mb-3 text-[11px] font-semibold uppercase tracking-wider text-surface-500">
                    Menú Principal
                </p>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                                active
                                    ? 'bg-primary-600/15 text-primary-400 shadow-sm'
                                    : 'text-surface-400 hover:text-white hover:bg-surface-800'
                            )}
                        >
                            <Icon size={20} className={active ? 'text-primary-400' : undefined} />
                            {item.label}
                            {active && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-400 shadow-sm shadow-primary-400/50" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile & Footer */}
            <div className="px-3 py-4 border-t border-surface-800 space-y-3">
                {/* User Info */}
                {perfil && (
                    <div className="px-3 py-2.5 rounded-xl bg-surface-800/50">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary-600/20 flex items-center justify-center">
                                <Shield size={14} className={rolInfo.color} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{perfil.nombre}</p>
                                <p className={cn('text-xs font-medium', rolInfo.color)}>{rolInfo.label}</p>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    onClick={signOut}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-surface-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                >
                    <LogOut size={20} />
                    Cerrar Sesión
                </button>
            </div>
        </>
    );

    if (loading) return null;

    return (
        <>
            {/* Mobile Hamburger */}
            <button
                onClick={() => setMobileOpen(true)}
                className="fixed top-4 left-4 z-50 p-2 rounded-xl bg-surface-800 border border-surface-700 text-surface-300 hover:text-white lg:hidden"
            >
                <Menu size={22} />
            </button>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 w-64 bg-surface-900 border-r border-surface-800 flex flex-col transform transition-transform duration-300 lg:hidden',
                    mobileOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <button
                    onClick={() => setMobileOpen(false)}
                    className="absolute top-4 right-4 p-1.5 rounded-lg text-surface-400 hover:text-white hover:bg-surface-800"
                >
                    <X size={20} />
                </button>
                {navContent}
            </aside>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:min-h-screen bg-surface-900 border-r border-surface-800 sticky top-0">
                {navContent}
            </aside>
        </>
    );
}
