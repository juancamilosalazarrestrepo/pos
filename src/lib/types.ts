// ── Database row types (match Supabase tables) ──

export interface Categoria {
  id: string;
  nombre: string;
  created_at: string;
}

export interface Producto {
  id: string;
  sku: string | null;
  nombre: string;
  precio_venta: number;
  stock_actual: number;
  categoria_id: string | null;
  created_at: string;
  // Joined field (from categorias table)
  categorias?: Categoria;
}

export interface Venta {
  id: string;
  total: number;
  metodo_pago: string | null;
  created_at: string;
  // Joined field
  detalle_ventas?: DetalleVenta[];
}

export interface DetalleVenta {
  id: string;
  venta_id: string;
  producto_id: string;
  cantidad: number;
  precio_unitario: number;
  // Joined field
  productos?: Producto;
}

// ── App-level types ──

export interface CartItem {
  product: Producto;
  quantity: number;
}

export type MetodoPago = 'efectivo' | 'tarjeta' | 'transferencia';
