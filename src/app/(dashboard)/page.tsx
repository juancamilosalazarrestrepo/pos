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
import { Producto, Venta } from '@/lib/types';
import { formatCOP } from '@/lib/utils';
import { useAuth } from '@/components/AuthProvider';

export default function DashboardPage() {
  const { supabase } = useAuth();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;

    async function load() {
      console.log("=== INICIANDO LOAD EN DASHBOARD ===");
      try {
        console.log("Llamando a fetchProductos...");
        const { data: prods, error: prodsError } = await supabase
          .from('productos')
          .select('*, categorias(id, nombre)')
          .order('nombre');

        if (prodsError) {
          console.error("Error productos:", prodsError);
          setErrorMsg("Error productos: " + prodsError.message);
        }
        console.log("fetchProductos retornó:", prods?.length, "items");

        console.log("Llamando a fetchVentas...");
        const { data: sales, error: salesError } = await supabase
          .from('ventas')
          .select('*, detalle_ventas(*, productos(id, nombre, sku))')
          .order('created_at', { ascending: false })
          .limit(20);

        if (salesError) {
          console.error("Error ventas:", salesError);
          setErrorMsg("Error ventas: " + salesError.message);
        }
        console.log("fetchVentas retornó:", sales?.length, "items");

        setProductos(prods || []);
        setVentas(sales || []);
      } catch (err: any) {
        console.error("ERROR FATAL EN LOAD DASHBOARD:", err);
        setErrorMsg(err.message || String(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [supabase]);

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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Ventas Hoy"
          value={formatCOP(todaySales)}
          icon={DollarSign}
        />
        <KPICard
          title="Transacciones"
          value={String(todayVentas.length)}
          icon={TrendingUp}
        />
        <KPICard
          title="Productos"
          value={String(productos.length)}
          icon={ShoppingBag}
        />
        <KPICard
          title="Stock Bajo"
          value={String(lowStockCount)}
          icon={AlertTriangle}
        />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTransactions ventas={ventas} loading={loading} />
        </div>
        <div>
          <LowStockAlert productos={productos} loading={loading} />
        </div>
      </div>
    </div>
  );
}
