-- =============================================
-- POS System — Database Schema
-- =============================================
-- Run these scripts in order in the Supabase SQL Editor.
-- File: 001_tables.sql

-- 1. Categorías
CREATE TABLE IF NOT EXISTS categorias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 2. Productos
CREATE TABLE IF NOT EXISTS productos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sku TEXT UNIQUE,
  nombre TEXT NOT NULL,
  precio_venta NUMERIC NOT NULL,
  stock_actual INT DEFAULT 0,
  categoria_id UUID REFERENCES categorias(id),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 3. Ventas
CREATE TABLE IF NOT EXISTS ventas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  total NUMERIC NOT NULL DEFAULT 0,
  metodo_pago TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 4. Detalle de Ventas
CREATE TABLE IF NOT EXISTS detalle_ventas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  venta_id UUID REFERENCES ventas(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES productos(id),
  cantidad INT NOT NULL,
  precio_unitario NUMERIC NOT NULL
);

-- 5. Perfiles de Usuario (vinculado a auth.users)
CREATE TABLE IF NOT EXISTS perfiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  rol TEXT NOT NULL DEFAULT 'cajero' CHECK (rol IN ('admin', 'cajero', 'inventario')),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_productos_category ON productos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_productos_sku ON productos(sku);
CREATE INDEX IF NOT EXISTS idx_ventas_created_at ON ventas(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_detalle_ventas_venta ON detalle_ventas(venta_id);
CREATE INDEX IF NOT EXISTS idx_perfiles_rol ON perfiles(rol);
