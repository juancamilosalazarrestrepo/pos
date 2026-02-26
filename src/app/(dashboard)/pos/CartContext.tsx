'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Producto, CartItem } from '@/lib/types';

// ── Actions ──
type CartAction =
    | { type: 'ADD_ITEM'; product: Producto }
    | { type: 'REMOVE_ITEM'; productId: string }
    | { type: 'UPDATE_QTY'; productId: string; quantity: number }
    | { type: 'CLEAR_CART' };

// ── State ──
interface CartState {
    items: CartItem[];
}

const initialState: CartState = { items: [] };

// ── Reducer ──
function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case 'ADD_ITEM': {
            const existing = state.items.find((i) => i.product.id === action.product.id);
            if (existing) {
                return {
                    items: state.items.map((i) =>
                        i.product.id === action.product.id
                            ? { ...i, quantity: i.quantity + 1 }
                            : i
                    ),
                };
            }
            return { items: [...state.items, { product: action.product, quantity: 1 }] };
        }
        case 'REMOVE_ITEM':
            return { items: state.items.filter((i) => i.product.id !== action.productId) };
        case 'UPDATE_QTY': {
            if (action.quantity <= 0) {
                return { items: state.items.filter((i) => i.product.id !== action.productId) };
            }
            return {
                items: state.items.map((i) =>
                    i.product.id === action.productId
                        ? { ...i, quantity: action.quantity }
                        : i
                ),
            };
        }
        case 'CLEAR_CART':
            return { items: [] };
        default:
            return state;
    }
}

// ── Context ──
interface CartContextType {
    items: CartItem[];
    addItem: (product: Producto) => void;
    removeItem: (productId: string) => void;
    updateQty: (productId: string, quantity: number) => void;
    clearCart: () => void;
    subtotal: number;
    tax: number;
    total: number;
    itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    const subtotal = state.items.reduce(
        (sum, i) => sum + Number(i.product.precio_venta) * i.quantity,
        0
    );
    const tax = Math.round(subtotal * 0.19); // IVA 19%
    const total = subtotal + tax;
    const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

    const addItem = (product: Producto) => dispatch({ type: 'ADD_ITEM', product });
    const removeItem = (productId: string) => dispatch({ type: 'REMOVE_ITEM', productId });
    const updateQty = (productId: string, quantity: number) =>
        dispatch({ type: 'UPDATE_QTY', productId, quantity });
    const clearCart = () => dispatch({ type: 'CLEAR_CART' });

    return (
        <CartContext.Provider
            value={{ items: state.items, addItem, removeItem, updateQty, clearCart, subtotal, tax, total, itemCount }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within CartProvider');
    return context;
}
