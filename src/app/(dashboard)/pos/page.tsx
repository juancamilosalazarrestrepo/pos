'use client';

import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { CartProvider } from './CartContext';
import ProductGrid from './ProductGrid';
import Cart from './Cart';
import PaymentModal from './PaymentModal';

function POSContent() {
    const [paymentOpen, setPaymentOpen] = useState(false);

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary-500/15">
                    <ShoppingCart size={22} className="text-primary-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Terminal POS</h1>
                    <p className="text-sm text-surface-400">Registra ventas y gestiona tu caja</p>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Left: Product Grid */}
                <div className="lg:col-span-3">
                    <ProductGrid />
                </div>

                {/* Right: Cart */}
                <div className="lg:col-span-2 lg:sticky lg:top-8 lg:self-start">
                    <Cart onCheckout={() => setPaymentOpen(true)} />
                </div>
            </div>

            {/* Payment Modal */}
            <PaymentModal isOpen={paymentOpen} onClose={() => setPaymentOpen(false)} />
        </div>
    );
}

export default function POSPage() {
    return (
        <CartProvider>
            <POSContent />
        </CartProvider>
    );
}
