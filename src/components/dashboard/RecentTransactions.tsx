'use client';

import React from 'react';
import { Venta } from '@/lib/types';
import { formatCOP, formatDate } from '@/lib/utils';
import Badge from '@/components/ui/Badge';

interface RecentTransactionsProps {
    ventas: Venta[];
    loading: boolean;
}

const paymentLabels: Record<string, { label: string; variant: 'info' | 'success' | 'warning' }> = {
    efectivo: { label: 'Efectivo', variant: 'success' },
    tarjeta: { label: 'Tarjeta', variant: 'info' },
    transferencia: { label: 'Transferencia', variant: 'warning' },
};

export default function RecentTransactions({ ventas, loading }: RecentTransactionsProps) {
    const recent = ventas.slice(0, 8);

    return (
        <div className="rounded-2xl bg-surface-800/80 border border-surface-700/50 overflow-hidden">
            <div className="px-5 py-4 border-b border-surface-700/50">
                <h3 className="font-semibold text-white">Transacciones Recientes</h3>
                <p className="text-xs text-surface-400 mt-0.5">Últimas ventas realizadas</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12 text-surface-400">
                    <p className="text-sm">Cargando...</p>
                </div>
            ) : recent.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-surface-400">
                    <p className="text-sm">No hay ventas registradas aún</p>
                </div>
            ) : (
                <>
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-surface-700/50">
                                    <th className="text-left text-xs font-medium text-surface-400 uppercase tracking-wider px-5 py-3">Fecha</th>
                                    <th className="text-left text-xs font-medium text-surface-400 uppercase tracking-wider px-5 py-3">Productos</th>
                                    <th className="text-right text-xs font-medium text-surface-400 uppercase tracking-wider px-5 py-3">Total</th>
                                    <th className="text-center text-xs font-medium text-surface-400 uppercase tracking-wider px-5 py-3">Método</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-700/30">
                                {recent.map((venta) => {
                                    const payment = paymentLabels[venta.metodo_pago || 'efectivo'];
                                    const productNames = venta.detalle_ventas
                                        ?.map((d) => d.productos?.nombre || 'Producto')
                                        .join(', ') || '—';
                                    return (
                                        <tr key={venta.id} className="hover:bg-surface-700/30 transition-colors">
                                            <td className="px-5 py-3.5 text-sm text-surface-300">{formatDate(venta.created_at)}</td>
                                            <td className="px-5 py-3.5 text-sm text-surface-300 max-w-xs truncate">{productNames}</td>
                                            <td className="px-5 py-3.5 text-sm text-white font-semibold text-right">{formatCOP(Number(venta.total))}</td>
                                            <td className="px-5 py-3.5 text-center">
                                                <Badge variant={payment?.variant || 'info'}>{payment?.label || venta.metodo_pago}</Badge>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card List */}
                    <div className="md:hidden divide-y divide-surface-700/30">
                        {recent.map((venta) => {
                            const payment = paymentLabels[venta.metodo_pago || 'efectivo'];
                            const productNames = venta.detalle_ventas
                                ?.map((d) => d.productos?.nombre || 'Producto')
                                .join(', ') || '—';
                            return (
                                <div key={venta.id} className="px-5 py-4 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-surface-500">{formatDate(venta.created_at)}</span>
                                        <Badge variant={payment?.variant || 'info'}>{payment?.label || venta.metodo_pago}</Badge>
                                    </div>
                                    <p className="text-sm text-surface-300 truncate">{productNames}</p>
                                    <div className="flex justify-end">
                                        <span className="text-sm font-semibold text-white">{formatCOP(Number(venta.total))}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
