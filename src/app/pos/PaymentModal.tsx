'use client';

import React, { useState } from 'react';
import { Banknote, CreditCard, ArrowRightLeft, CheckCircle2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useCart } from './CartContext';
import { formatCOP, cn } from '@/lib/utils';
import { MetodoPago } from '@/lib/types';
import { insertVenta } from '@/lib/api';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const methods: { value: MetodoPago; label: string; icon: React.ElementType; color: string }[] = [
    { value: 'efectivo', label: 'Efectivo', icon: Banknote, color: 'text-emerald-400' },
    { value: 'tarjeta', label: 'Tarjeta', icon: CreditCard, color: 'text-primary-400' },
    { value: 'transferencia', label: 'Transferencia', icon: ArrowRightLeft, color: 'text-amber-400' },
];

export default function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
    const { items, total, clearCart } = useCart();
    const [selectedMethod, setSelectedMethod] = useState<MetodoPago>('efectivo');
    const [cashReceived, setCashReceived] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const change = selectedMethod === 'efectivo' ? Number(cashReceived) - total : 0;
    const canPay = selectedMethod !== 'efectivo' || Number(cashReceived) >= total;

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await insertVenta({
                total,
                metodo_pago: selectedMethod,
                items: items.map((item) => ({
                    producto_id: item.product.id,
                    cantidad: item.quantity,
                    precio_unitario: Number(item.product.precio_venta),
                })),
            });
            setSuccess(true);
            setTimeout(() => {
                clearCart();
                setSuccess(false);
                setCashReceived('');
                setSelectedMethod('efectivo');
                onClose();
            }, 1500);
        } catch (error) {
            console.error('Error processing sale:', error);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} title="Venta Completada">
                <div className="flex flex-col items-center py-8">
                    <div className="p-4 rounded-full bg-emerald-500/15 mb-4">
                        <CheckCircle2 size={48} className="text-emerald-400" />
                    </div>
                    <p className="text-lg font-bold text-white">¡Venta Exitosa!</p>
                    <p className="text-sm text-surface-400 mt-1">Total: {formatCOP(total)}</p>
                    {selectedMethod === 'efectivo' && change > 0 && (
                        <p className="text-sm text-emerald-400 mt-2 font-semibold">
                            Cambio: {formatCOP(change)}
                        </p>
                    )}
                </div>
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Finalizar Venta" maxWidth="max-w-md">
            <div className="space-y-5">
                {/* Total Display */}
                <div className="text-center py-4 rounded-xl bg-surface-900 border border-surface-700">
                    <p className="text-sm text-surface-400">Total a Pagar</p>
                    <p className="text-3xl font-bold text-primary-400 mt-1">{formatCOP(total)}</p>
                </div>

                {/* Payment Method */}
                <div>
                    <p className="text-sm font-medium text-surface-300 mb-3">Método de Pago</p>
                    <div className="grid grid-cols-3 gap-2">
                        {methods.map((method) => {
                            const Icon = method.icon;
                            const active = selectedMethod === method.value;
                            return (
                                <button
                                    key={method.value}
                                    onClick={() => setSelectedMethod(method.value)}
                                    className={cn(
                                        'flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200',
                                        active
                                            ? 'bg-primary-600/15 border-primary-500/40 text-white'
                                            : 'bg-surface-900 border-surface-700 text-surface-400 hover:border-surface-500'
                                    )}
                                >
                                    <Icon size={24} className={active ? method.color : undefined} />
                                    <span className="text-xs font-medium">{method.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Cash Input */}
                {selectedMethod === 'efectivo' && (
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-surface-300 mb-1.5">
                                Monto Recibido (COP)
                            </label>
                            <input
                                type="number"
                                value={cashReceived}
                                onChange={(e) => setCashReceived(e.target.value)}
                                placeholder="0"
                                min={0}
                                className="w-full px-4 py-3 bg-surface-900 border border-surface-700 rounded-xl text-lg text-white text-center font-bold placeholder:text-surface-600 focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-all"
                            />
                        </div>
                        {Number(cashReceived) > 0 && (
                            <div
                                className={cn(
                                    'flex justify-between items-center p-3 rounded-xl',
                                    change >= 0
                                        ? 'bg-emerald-500/10 border border-emerald-500/20'
                                        : 'bg-red-500/10 border border-red-500/20'
                                )}
                            >
                                <span className="text-sm font-medium text-surface-300">Cambio</span>
                                <span className={cn('text-lg font-bold', change >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                                    {formatCOP(Math.max(0, change))}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Quick cash buttons */}
                {selectedMethod === 'efectivo' && (
                    <div className="flex flex-wrap gap-2">
                        {[5000, 10000, 20000, 50000, 100000].map((amount) => (
                            <button
                                key={amount}
                                onClick={() => setCashReceived(amount.toString())}
                                className="px-3 py-1.5 rounded-lg bg-surface-700 text-surface-300 text-xs font-medium hover:bg-surface-600 hover:text-white transition-colors"
                            >
                                {formatCOP(amount)}
                            </button>
                        ))}
                    </div>
                )}

                <Button onClick={handleConfirm} disabled={!canPay || loading} size="lg" className="w-full">
                    {loading ? 'Procesando...' : `Confirmar Pago — ${formatCOP(total)}`}
                </Button>
            </div>
        </Modal>
    );
}
