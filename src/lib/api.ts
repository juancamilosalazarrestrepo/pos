import { createSupabaseBrowser } from './supabase-browser';
import { Producto, Categoria, Venta, MetodoPago } from './types';

function getSupabase() {
    return createSupabaseBrowser();
}

// ── Categorías ──

export async function fetchCategorias(): Promise<Categoria[]> {
    const supabase = getSupabase();
    const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .order('nombre');

    if (error) {
        console.error('Error fetching categorias:', error);
        return [];
    }
    return data || [];
}

export async function insertCategoria(nombre: string): Promise<Categoria | null> {
    const supabase = getSupabase();
    const { data, error } = await supabase
        .from('categorias')
        .insert({ nombre })
        .select()
        .single();

    if (error) {
        console.error('Error inserting categoria:', error);
        return null;
    }
    return data;
}

// ── Productos ──

export async function fetchProductos(): Promise<Producto[]> {
    try {
        const supabase = getSupabase();

        const result = await supabase
            .from('productos')
            .select('*, categorias(id, nombre)')
            .order('nombre');

        if (result.error) {
            console.error('Error fetching productos:', result.error);
            return [];
        }
        return result.data || [];
    } catch (err) {
        console.error("fetchProductos FETCH CATCH ERROR:", err);
        return [];
    }
}

export async function insertProducto(
    producto: Omit<Producto, 'id' | 'created_at' | 'categorias'>
): Promise<Producto | null> {
    const supabase = getSupabase();
    const { data, error } = await supabase
        .from('productos')
        .insert(producto)
        .select('*, categorias(id, nombre)')
        .single();

    if (error) {
        console.error('Error inserting producto:', error);
        return null;
    }
    return data;
}

export async function updateProductoStock(
    productoId: string,
    newStock: number
): Promise<boolean> {
    const supabase = getSupabase();
    const { error } = await supabase
        .from('productos')
        .update({ stock_actual: newStock })
        .eq('id', productoId);

    if (error) {
        console.error('Error updating stock:', error);
        return false;
    }
    return true;
}

// ── Ventas ──

export async function fetchVentas(): Promise<Venta[]> {
    try {
        const supabase = getSupabase();

        const result = await supabase
            .from('ventas')
            .select('*, detalle_ventas(*, productos(id, nombre, sku))')
            .order('created_at', { ascending: false })
            .limit(20);

        if (result.error) {
            console.error('Error fetching ventas:', result.error);
            return [];
        }
        return result.data || [];
    } catch (err) {
        console.error("fetchVentas CATCH ERROR:", err);
        return [];
    }
}

interface NuevaVenta {
    total: number;
    metodo_pago: MetodoPago;
    items: { producto_id: string; cantidad: number; precio_unitario: number }[];
}

export async function insertVenta(venta: NuevaVenta): Promise<Venta | null> {
    const supabase = getSupabase();

    // 1. Insert the sale
    const { data: ventaData, error: ventaError } = await supabase
        .from('ventas')
        .insert({ total: venta.total, metodo_pago: venta.metodo_pago })
        .select()
        .single();

    if (ventaError || !ventaData) {
        console.error('Error inserting venta:', ventaError);
        return null;
    }

    // 2. Insert sale items
    const detalles = venta.items.map((item) => ({
        venta_id: ventaData.id,
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
    }));

    const { error: detalleError } = await supabase
        .from('detalle_ventas')
        .insert(detalles);

    if (detalleError) {
        console.error('Error inserting detalle_ventas:', detalleError);
    }

    // 3. Update stock for each product
    for (const item of venta.items) {
        const { data: prod } = await supabase
            .from('productos')
            .select('stock_actual')
            .eq('id', item.producto_id)
            .single();

        if (prod) {
            await supabase
                .from('productos')
                .update({ stock_actual: prod.stock_actual - item.cantidad })
                .eq('id', item.producto_id);
        }
    }

    return ventaData;
}
