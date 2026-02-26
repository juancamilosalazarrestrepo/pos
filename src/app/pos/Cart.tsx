'use client';

import React from 'react';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { useCart } from './CartContext';
import { formatCOP } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface CartProps {
    onCheckout: () => void;
}

export default function Cart({ onCheckout }: CartProps) {
    const { items, updateQty, removeItem, subtotal, tax, total, itemCount } = useCart();

    if (items.length === 0) {
        return (
            <div className="flex flex-col h-full rounded-2xl bg-surface-800/80 border border-surface-700/50">
                <div className="px-5 py-4 border-b border-surface-700/50">
                    <h2 className="font-semibold text-white flex items-center gap-2">
                        <ShoppingCart size={20} className="text-primary-400" />
                        Ticket de Venta
                    </h2>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center text-surface-400 p-6">
                    <ShoppingCart size={48} className="mb-3 opacity-25" />
                    <p className="text-sm font-medium">Carrito vacío</p>
                    <p className="text-xs mt-1 text-center">Selecciona productos para agregarlos al ticket</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full rounded-2xl bg-surface-800/80 border border-surface-700/50">
            <div className="px-5 py-4 border-b border-surface-700/50">
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-white flex items-center gap-2">
                        <ShoppingCart size={20} className="text-primary-400" />
                        Ticket de Venta
                    </h2>
                    <span className="text-xs text-surface-400 bg-surface-700 px-2 py-1 rounded-full">
                        {itemCount} artículos
                    </span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-surface-700/30">
                {items.map((item) => (
                    <div key={item.product.id} className="px-5 py-3.5 hover:bg-surface-700/20 transition-colors">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{item.product.nombre}</p>
                                <p className="text-xs text-surface-400 mt-0.5">
                                    {formatCOP(Number(item.product.precio_venta))} c/u
                                </p>
                            </div>
                            <p className="text-sm font-semibold text-white whitespace-nowrap">
                                {formatCOP(Number(item.product.precio_venta) * item.quantity)}
                            </p>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => updateQty(item.product.id, item.quantity - 1)}
                                    className="p-1 rounded-md bg-surface-700 text-surface-300 hover:bg-surface-600 hover:text-white transition-colors"
                                >
                                    <Minus size={14} />
                                </button>
                                <span className="w-8 text-center text-sm font-medium text-white">
                                    {item.quantity}
                                </span>
                                <button
                                    onClick={() => updateQty(item.product.id, item.quantity + 1)}
                                    className="p-1 rounded-md bg-surface-700 text-surface-300 hover:bg-surface-600 hover:text-white transition-colors"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                            <button
                                onClick={() => removeItem(item.product.id)}
                                className="p-1.5 rounded-md text-surface-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-t border-surface-700/50 p-5 space-y-2.5">
                <div className="flex justify-between text-sm">
                    <span className="text-surface-400">Subtotal</span>
                    <span className="text-surface-200">{formatCOP(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-surface-400">IVA (19%)</span>
                    <span className="text-surface-200">{formatCOP(tax)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-surface-700/50">
                    <span className="text-white">Total</span>
                    <span className="text-primary-400">{formatCOP(total)}</span>
                </div>

                <Button onClick={onCheckout} size="lg" className="w-full mt-3">
                    Finalizar Venta
                </Button>
            </div>
        </div>
    );
}
