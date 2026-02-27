'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Users, Plus, Shield, UserCheck, UserX, Loader2 } from 'lucide-react';
import { createSupabaseBrowser } from '@/lib/supabase-browser';
import { useAuth } from '@/components/AuthProvider';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { formatDate } from '@/lib/utils';

interface Perfil {
    id: string;
    nombre: string;
    email: string;
    rol: string;
    activo: boolean;
    created_at: string;
}

const rolBadge: Record<string, 'info' | 'success' | 'warning'> = {
    admin: 'info',
    cajero: 'success',
    inventario: 'warning',
};

export default function UsuariosPage() {
    const { perfil: currentUser } = useAuth();
    const [perfiles, setPerfiles] = useState<Perfil[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        nombre: '',
        email: '',
        password: '',
        rol: 'cajero',
    });

    const supabase = createSupabaseBrowser();

    const loadPerfiles = useCallback(async () => {
        setLoading(true);
        const { data } = await supabase
            .from('perfiles')
            .select('*')
            .order('created_at', { ascending: false });
        setPerfiles(data || []);
        setLoading(false);
    }, [supabase]);

    useEffect(() => {
        loadPerfiles();
    }, [loadPerfiles]);

    // Only admins can access this page
    if (currentUser?.rol !== 'admin') {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Shield size={48} className="mx-auto mb-4 text-red-400 opacity-50" />
                    <p className="text-lg font-semibold text-white">Acceso Denegado</p>
                    <p className="text-sm text-surface-400 mt-1">Solo los administradores pueden gestionar usuarios.</p>
                </div>
            </div>
        );
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        setError('');

        try {
            // Import the server action dynamically to avoid client component issues
            const { crearUsuarioAdmin } = await import('@/app/actions/usuarios');

            // Call the server action which uses the Service Role Key
            const result = await crearUsuarioAdmin({
                email: form.email,
                password: form.password,
                nombre: form.nombre,
                rol: form.rol
            });

            if (result.error) {
                setError(result.error);
                setFormLoading(false);
                return;
            }

            setModalOpen(false);
            setForm({ nombre: '', email: '', password: '', rol: 'cajero' });

            // Wait a moment for the DB trigger to create the profile row
            setTimeout(() => loadPerfiles(), 1000);
        } catch (err: any) {
            setError(err.message || 'Error al crear usuario');
        } finally {
            setFormLoading(false);
        }
    };

    const toggleActive = async (perfil: Perfil) => {
        await supabase
            .from('perfiles')
            .update({ activo: !perfil.activo })
            .eq('id', perfil.id);
        loadPerfiles();
    };

    const inputClass =
        'w-full px-3 py-2.5 bg-surface-900 border border-surface-700 rounded-xl text-sm text-white placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-all';

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-primary-500/15">
                        <Users size={22} className="text-primary-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Usuarios</h1>
                        <p className="text-sm text-surface-400">Gestiona los usuarios del sistema</p>
                    </div>
                </div>
                <Button onClick={() => setModalOpen(true)}>
                    <Plus size={18} />
                    Nuevo Usuario
                </Button>
            </div>

            {/* Users Table */}
            <div className="rounded-2xl bg-surface-800/80 border border-surface-700/50 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 size={24} className="animate-spin text-surface-400" />
                    </div>
                ) : (
                    <>
                        {/* Desktop */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-surface-700/50">
                                        <th className="text-left text-xs font-medium text-surface-400 uppercase tracking-wider px-5 py-3">Nombre</th>
                                        <th className="text-left text-xs font-medium text-surface-400 uppercase tracking-wider px-5 py-3">Email</th>
                                        <th className="text-center text-xs font-medium text-surface-400 uppercase tracking-wider px-5 py-3">Rol</th>
                                        <th className="text-center text-xs font-medium text-surface-400 uppercase tracking-wider px-5 py-3">Estado</th>
                                        <th className="text-center text-xs font-medium text-surface-400 uppercase tracking-wider px-5 py-3">Fecha</th>
                                        <th className="text-center text-xs font-medium text-surface-400 uppercase tracking-wider px-5 py-3">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-surface-700/30">
                                    {perfiles.map((p) => (
                                        <tr key={p.id} className="hover:bg-surface-700/30 transition-colors">
                                            <td className="px-5 py-3.5">
                                                <p className="text-sm font-medium text-white">{p.nombre}</p>
                                            </td>
                                            <td className="px-5 py-3.5 text-sm text-surface-300">{p.email}</td>
                                            <td className="px-5 py-3.5 text-center">
                                                <Badge variant={rolBadge[p.rol] || 'info'}>
                                                    {p.rol.charAt(0).toUpperCase() + p.rol.slice(1)}
                                                </Badge>
                                            </td>
                                            <td className="px-5 py-3.5 text-center">
                                                <Badge variant={p.activo ? 'success' : 'danger'}>
                                                    {p.activo ? 'Activo' : 'Inactivo'}
                                                </Badge>
                                            </td>
                                            <td className="px-5 py-3.5 text-sm text-surface-400 text-center">
                                                {formatDate(p.created_at)}
                                            </td>
                                            <td className="px-5 py-3.5 text-center">
                                                <button
                                                    onClick={() => toggleActive(p)}
                                                    className="p-1.5 rounded-lg text-surface-400 hover:text-white transition-colors"
                                                    title={p.activo ? 'Desactivar' : 'Activar'}
                                                >
                                                    {p.activo ? <UserX size={16} /> : <UserCheck size={16} />}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile */}
                        <div className="md:hidden divide-y divide-surface-700/30">
                            {perfiles.map((p) => (
                                <div key={p.id} className="px-5 py-4 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-white">{p.nombre}</p>
                                        <Badge variant={p.activo ? 'success' : 'danger'}>
                                            {p.activo ? 'Activo' : 'Inactivo'}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-surface-400">{p.email}</span>
                                        <Badge variant={rolBadge[p.rol] || 'info'}>
                                            {p.rol.charAt(0).toUpperCase() + p.rol.slice(1)}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Create User Modal */}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo Usuario" maxWidth="max-w-md">
                <form onSubmit={handleCreate} className="space-y-4">
                    {error && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                            <p className="text-sm text-red-400">{error}</p>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-surface-300 mb-1.5">Nombre *</label>
                        <input
                            name="nombre"
                            value={form.nombre}
                            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                            placeholder="Nombre completo"
                            required
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-surface-300 mb-1.5">Email *</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="correo@ejemplo.com"
                            required
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-surface-300 mb-1.5">Contraseña *</label>
                        <input
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            placeholder="Mínimo 6 caracteres"
                            required
                            minLength={6}
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-surface-300 mb-1.5">Rol *</label>
                        <select
                            value={form.rol}
                            onChange={(e) => setForm({ ...form, rol: e.target.value })}
                            className={inputClass}
                        >
                            <option value="cajero">Cajero</option>
                            <option value="inventario">Inventario</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t border-surface-700">
                        <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={formLoading}>
                            {formLoading ? 'Creando...' : 'Crear Usuario'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
