'use client';

import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, Package } from 'lucide-react';
import { Producto, Categoria } from '@/lib/types';
import { formatCOP, cn } from '@/lib/utils';
import Badge from '@/components/ui/Badge';

interface ProductsTableProps {
    productos: Producto[];
    categorias: Categoria[];
    loading: boolean;
    onEdit?: (product: Producto) => void;
}

type SortKey = 'nombre' | 'sku' | 'categoria' | 'precio_venta' | 'stock_actual';
type SortDir = 'asc' | 'desc';

export default function ProductsTable({ productos, categorias, loading, onEdit }: ProductsTableProps) {
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [sortKey, setSortKey] = useState<SortKey>('nombre');
    const [sortDir, setSortDir] = useState<SortDir>('asc');

    const filtered = useMemo(() => {
        let list = [...productos];

        if (search) {
            const q = search.toLowerCase();
            list = list.filter(
                (p) =>
                    p.nombre.toLowerCase().includes(q) ||
                    (p.sku && p.sku.toLowerCase().includes(q)) ||
                    (p.categorias?.nombre && p.categorias.nombre.toLowerCase().includes(q))
            );
        }

        if (categoryFilter) {
            list = list.filter((p) => p.categoria_id === categoryFilter);
        }

        list.sort((a, b) => {
            let cmp = 0;
            if (sortKey === 'nombre') cmp = a.nombre.localeCompare(b.nombre);
            else if (sortKey === 'sku') cmp = (a.sku || '').localeCompare(b.sku || '');
            else if (sortKey === 'categoria') cmp = (a.categorias?.nombre || '').localeCompare(b.categorias?.nombre || '');
            else if (sortKey === 'precio_venta') cmp = Number(a.precio_venta) - Number(b.precio_venta);
            else if (sortKey === 'stock_actual') cmp = a.stock_actual - b.stock_actual;
            return sortDir === 'asc' ? cmp : -cmp;
        });

        return list;
    }, [productos, search, categoryFilter, sortKey, sortDir]);

    const toggleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDir('asc');
        }
    };

    const SortIcon = ({ column }: { column: SortKey }) => {
        if (sortKey !== column) return <ChevronDown size={14} className="opacity-30" />;
        return sortDir === 'asc' ? (
            <ChevronUp size={14} className="text-primary-400" />
        ) : (
            <ChevronDown size={14} className="text-primary-400" />
        );
    };

    const stockBadge = (product: Producto) => {
        if (product.stock_actual === 0) return <Badge variant="danger">Agotado</Badge>;
        if (product.stock_actual <= 5) return <Badge variant="warning">{product.stock_actual} uds</Badge>;
        return <Badge variant="success">{product.stock_actual} uds</Badge>;
    };

    if (loading) {
        return (
            <div className="rounded-2xl bg-surface-800/80 border border-surface-700/50 p-12 flex items-center justify-center">
                <p className="text-sm text-surface-400">Cargando productos...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, SKU o categoría..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-surface-800 border border-surface-700 rounded-xl text-sm text-white placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/40 transition-all"
                    />
                </div>
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-4 py-2.5 bg-surface-800 border border-surface-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 appearance-none cursor-pointer min-w-[160px]"
                >
                    <option value="">Todas las categorías</option>
                    {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.nombre}
                        </option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="rounded-2xl bg-surface-800/80 border border-surface-700/50 overflow-hidden">
                {/* Desktop */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-surface-700/50">
                                {([
                                    ['sku', 'SKU'],
                                    ['nombre', 'Nombre'],
                                    ['categoria', 'Categoría'],
                                    ['precio_venta', 'Precio'],
                                    ['stock_actual', 'Stock'],
                                ] as [SortKey, string][]).map(([key, label]) => (
                                    <th
                                        key={key}
                                        onClick={() => toggleSort(key)}
                                        className={cn(
                                            'text-left text-xs font-medium uppercase tracking-wider px-5 py-3 cursor-pointer hover:text-white transition-colors select-none',
                                            sortKey === key ? 'text-primary-400' : 'text-surface-400',
                                            key === 'precio_venta' && 'text-right',
                                            key === 'stock_actual' && 'text-center'
                                        )}
                                    >
                                        <span className="inline-flex items-center gap-1">
                                            {label}
                                            <SortIcon column={key} />
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-700/30">
                            {filtered.map((product) => (
                                <tr
                                    key={product.id}
                                    onClick={() => onEdit?.(product)}
                                    className="hover:bg-surface-700/30 transition-colors cursor-pointer"
                                >
                                    <td className="px-5 py-3.5 text-sm font-mono text-surface-300">
                                        {product.sku || '—'}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-surface-700 flex items-center justify-center flex-shrink-0">
                                                <Package size={16} className="text-surface-400" />
                                            </div>
                                            <p className="text-sm font-medium text-white">{product.nombre}</p>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <Badge>{product.categorias?.nombre || 'Sin categoría'}</Badge>
                                    </td>
                                    <td className="px-5 py-3.5 text-sm text-white font-semibold text-right">
                                        {formatCOP(Number(product.precio_venta))}
                                    </td>
                                    <td className="px-5 py-3.5 text-center">
                                        {stockBadge(product)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-surface-700/30">
                    {filtered.map((product) => (
                        <div
                            key={product.id}
                            onClick={() => onEdit?.(product)}
                            className="px-5 py-4 space-y-2 cursor-pointer hover:bg-surface-700/30 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-white">{product.nombre}</p>
                                {stockBadge(product)}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-mono text-surface-400">{product.sku || '—'}</span>
                                <Badge>{product.categorias?.nombre || 'Sin categoría'}</Badge>
                            </div>
                            <div className="flex justify-end">
                                <span className="text-sm font-semibold text-white">{formatCOP(Number(product.precio_venta))}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-surface-400">
                        <Package size={40} className="mb-3 opacity-40" />
                        <p className="text-sm font-medium">No se encontraron productos</p>
                        <p className="text-xs mt-1">Intenta cambiar los filtros de búsqueda</p>
                    </div>
                )}
            </div>

            <p className="text-xs text-surface-500 text-right">
                {filtered.length} de {productos.length} productos
            </p>
        </div>
    );
}
