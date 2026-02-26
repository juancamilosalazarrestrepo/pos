'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Producto } from '@/lib/types';
import { formatCOP } from '@/lib/utils';

interface LowStockAlertProps {
    productos: Producto[];
    loading: boolean;
}

export default function LowStockAlert({ productos, loading }: LowStockAlertProps) {
    const lowStock = productos.filter((p) => p.stock_actual <= 5);

    if (loading) {
        return (
            <div className="rounded-2xl bg-surface-800/80 border border-surface-700/50 p-6 flex items-center justify-center">
                <p className="text-sm text-surface-400">Cargando...</p>
            </div>
        );
    }

    if (lowStock.length === 0) {
        return (
            <div className="rounded-2xl bg-surface-800/80 border border-surface-700/50 p-6">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-emerald-500/15">
                        <AlertTriangle size={18} className="text-emerald-400" />
                    </div>
                    <h3 className="font-semibold text-white">Stock Bajo</h3>
                </div>
                <p className="text-sm text-surface-400">Todos los productos tienen stock suficiente ✅</p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl bg-surface-800/80 border border-surface-700/50 overflow-hidden">
            <div className="px-5 py-4 border-b border-surface-700/50 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/15">
                    <AlertTriangle size={18} className="text-amber-400" />
                </div>
                <div>
                    <h3 className="font-semibold text-white">Stock Bajo</h3>
                    <p className="text-xs text-surface-400">{lowStock.length} productos necesitan reabastecimiento</p>
                </div>
            </div>

            <div className="divide-y divide-surface-700/30">
                {lowStock.map((product) => (
                    <div
                        key={product.id}
                        className="flex items-center justify-between px-5 py-3.5 hover:bg-surface-700/30 transition-colors"
                    >
                        <div>
                            <p className="text-sm font-medium text-white">{product.nombre}</p>
                            <p className="text-xs text-surface-400">
                                {product.sku || '—'} • {product.categorias?.nombre || 'Sin categoría'}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className={`text-sm font-bold ${product.stock_actual === 0 ? 'text-red-400' : 'text-amber-400'}`}>
                                {product.stock_actual} uds
                            </p>
                            <p className="text-xs text-surface-500">{formatCOP(Number(product.precio_venta))}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
