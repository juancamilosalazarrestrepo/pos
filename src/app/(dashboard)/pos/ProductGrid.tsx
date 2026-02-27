'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { fetchProductos, fetchCategorias } from '@/lib/api';
import { Producto, Categoria } from '@/lib/types';
import { formatCOP, cn, getCategoryEmoji } from '@/lib/utils';
import { useCart } from './CartContext';

export default function ProductGrid() {
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('');
    const [productos, setProductos] = useState<Producto[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);
    const { addItem } = useCart();

    useEffect(() => {
        async function load() {
            const [prods, cats] = await Promise.all([fetchProductos(), fetchCategorias()]);
            setProductos(prods);
            setCategorias(cats);
            setLoading(false);
        }
        load();
    }, []);

    const filtered = useMemo(() => {
        let list = productos.filter((p) => p.stock_actual > 0);
        if (search) {
            const q = search.toLowerCase();
            list = list.filter(
                (p) =>
                    p.nombre.toLowerCase().includes(q) ||
                    (p.sku && p.sku.toLowerCase().includes(q))
            );
        }
        if (activeCategory) {
            list = list.filter((p) => p.categoria_id === activeCategory);
        }
        return list;
    }, [productos, search, activeCategory]);

    if (loading) {
        return (
            <div className="rounded-2xl bg-surface-800/80 border border-surface-700/50 p-12 flex items-center justify-center">
                <p className="text-sm text-surface-400">Cargando productos...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                    type="text"
                    placeholder="Buscar producto..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-surface-800 border border-surface-700 rounded-xl text-sm text-white placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-all"
                />
            </div>

            {/* Category Filters */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                <button
                    onClick={() => setActiveCategory('')}
                    className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0',
                        !activeCategory
                            ? 'bg-primary-600 text-white'
                            : 'bg-surface-800 text-surface-400 hover:text-white hover:bg-surface-700'
                    )}
                >
                    Todos
                </button>
                {categorias.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id === activeCategory ? '' : cat.id)}
                        className={cn(
                            'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0',
                            activeCategory === cat.id
                                ? 'bg-primary-600 text-white'
                                : 'bg-surface-800 text-surface-400 hover:text-white hover:bg-surface-700'
                        )}
                    >
                        {cat.nombre}
                    </button>
                ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                {filtered.map((product) => (
                    <button
                        key={product.id}
                        onClick={() => addItem(product)}
                        className="group relative rounded-xl bg-surface-800/80 border border-surface-700/50 p-4 text-left hover:border-primary-500/30 hover:bg-surface-700/50 transition-all duration-200 active:scale-[0.98]"
                    >
                        <div className="w-full aspect-square rounded-lg bg-surface-700/50 flex items-center justify-center mb-3 group-hover:bg-surface-600/50 transition-colors">
                            <span className="text-2xl">
                                {getCategoryEmoji(product.categorias?.nombre || '')}
                            </span>
                        </div>

                        <p className="text-sm font-medium text-white truncate">{product.nombre}</p>
                        <p className="text-xs text-surface-400 mt-0.5">{product.stock_actual} disponibles</p>
                        <p className="text-sm font-bold text-primary-400 mt-1.5">
                            {formatCOP(Number(product.precio_venta))}
                        </p>

                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="p-1.5 rounded-lg bg-primary-600 text-white shadow-lg shadow-primary-600/30">
                                <Plus size={16} />
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-surface-400">
                    <Search size={40} className="mb-3 opacity-30" />
                    <p className="text-sm">No se encontraron productos</p>
                </div>
            )}
        </div>
    );
}
