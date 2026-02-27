'use client';

import React, { useEffect, useState } from 'react';
import {
  DollarSign,
  ShoppingBag,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import KPICard from '@/components/dashboard/KPICard';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import LowStockAlert from '@/components/dashboard/LowStockAlert';
import { fetchProductos, fetchVentas } from '@/lib/api';
import { Producto, Venta } from '@/lib/types';
import { formatCOP } from '@/lib/utils';
import { createSupabaseBrowser } from '@/lib/supabase-browser';

export default function DashboardPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const prods = await fetchProductos();
        const sales = await fetchVentas();
        setProductos(prods);
        setVentas(sales);
      } catch (err: any) {
        setErrorMsg(err.message || String(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todayVentas = ventas.filter((v) => v.created_at.startsWith(today));
  const todaySales = todayVentas.reduce((sum, v) => sum + Number(v.total), 0);
  const lowStockCount = productos.filter((p) => p.stock_actual <= 5).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Error Banner */}
      {errorMsg && (
        <div className="rounded-xl bg-red-900/20 border border-red-500/50 p-4 mb-6">
          <p className="text-sm font-semibold text-red-400">Error cargando datos:</p>
          <p className="text-xs font-mono text-red-300 mt-1">{errorMsg}</p>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-sm text-surface-400 mt-1">
          Bienvenido de vuelta. Aquí tienes tu resumen del día.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          title="Ventas del Día"
          value={loading ? '...' : formatCOP(todaySales)}
          icon={DollarSign}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/15"
        />
        <KPICard
          title="Transacciones Hoy"
          value={loading ? '...' : todayVentas.length.toString()}
          icon={ShoppingBag}
          iconColor="text-primary-400"
          iconBg="bg-primary-500/15"
        />
        <KPICard
          title="Productos Bajo Stock"
          value={loading ? '...' : lowStockCount.toString()}
          icon={AlertTriangle}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/15"
        />
        <KPICard
          title="Total Productos"
          value={loading ? '...' : productos.length.toString()}
          icon={TrendingUp}
          iconColor="text-cyan-400"
          iconBg="bg-cyan-500/15"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RecentTransactions ventas={ventas} loading={loading} />
        </div>
        <div>
          <LowStockAlert productos={productos} loading={loading} />
        </div>
      </div>
    </div>
  );
}
