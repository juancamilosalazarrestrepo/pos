'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Package } from 'lucide-react';
import Button from '@/components/ui/Button';
import ProductsTable from '@/components/inventory/ProductsTable';
import ProductModal from '@/components/inventory/ProductModal';
import { fetchProductos, fetchCategorias } from '@/lib/api';
import { Producto, Categoria } from '@/lib/types';

export default function InventarioPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        setLoading(true);
        const [prods, cats] = await Promise.all([fetchProductos(), fetchCategorias()]);
        setProductos(prods);
        setCategorias(cats);
        setLoading(false);
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-primary-500/15">
                        <Package size={22} className="text-primary-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Inventario</h1>
                        <p className="text-sm text-surface-400">Gestiona tus productos y stock</p>
                    </div>
                </div>
                <Button onClick={() => setModalOpen(true)}>
                    <Plus size={18} />
                    Nuevo Producto
                </Button>
            </div>

            {/* Table */}
            <ProductsTable
                productos={productos}
                categorias={categorias}
                loading={loading}
            />

            {/* Modal */}
            <ProductModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                categorias={categorias}
                onProductCreated={loadData}
            />
        </div>
    );
}
