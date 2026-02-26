'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Categoria } from '@/lib/types';
import { insertProducto } from '@/lib/api';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    categorias: Categoria[];
    onProductCreated: () => void;
}

export default function ProductModal({ isOpen, onClose, categorias, onProductCreated }: ProductModalProps) {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        sku: '',
        nombre: '',
        categoria_id: '',
        precio_venta: '',
        stock_actual: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await insertProducto({
                sku: form.sku || null,
                nombre: form.nombre,
                categoria_id: form.categoria_id || null,
                precio_venta: Number(form.precio_venta),
                stock_actual: Number(form.stock_actual),
            });
            if (result) {
                onProductCreated();
                onClose();
                setForm({ sku: '', nombre: '', categoria_id: '', precio_venta: '', stock_actual: '' });
            }
        } catch (error) {
            console.error('Error creating product:', error);
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        'w-full px-3 py-2.5 bg-surface-900 border border-surface-700 rounded-xl text-sm text-white placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/40 transition-all';
    const labelClass = 'block text-sm font-medium text-surface-300 mb-1.5';

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Nuevo Producto" maxWidth="max-w-xl">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>SKU</label>
                        <input
                            name="sku"
                            value={form.sku}
                            onChange={handleChange}
                            placeholder="BEB-001"
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Nombre *</label>
                        <input
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            placeholder="Nombre del producto"
                            required
                            className={inputClass}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Categoría</label>
                        <select
                            name="categoria_id"
                            value={form.categoria_id}
                            onChange={handleChange}
                            className={inputClass}
                        >
                            <option value="">Sin categoría</option>
                            {categorias.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Precio de Venta (COP) *</label>
                        <input
                            type="number"
                            name="precio_venta"
                            value={form.precio_venta}
                            onChange={handleChange}
                            placeholder="0"
                            required
                            min={0}
                            className={inputClass}
                        />
                    </div>
                </div>

                <div className="w-1/2">
                    <label className={labelClass}>Stock Inicial *</label>
                    <input
                        type="number"
                        name="stock_actual"
                        value={form.stock_actual}
                        onChange={handleChange}
                        placeholder="0"
                        required
                        min={0}
                        className={inputClass}
                    />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-surface-700">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar Producto'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
