-- =============================================
-- POS System — Row Level Security Policies
-- =============================================
-- File: 002_rls_policies.sql
-- Run AFTER 001_tables.sql

-- Enable RLS on all tables
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE detalle_ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;

-- ── Categorías ──
DROP POLICY IF EXISTS "Authenticated users can read categorias" ON categorias;
CREATE POLICY "Authenticated users can read categorias"
  ON categorias FOR SELECT
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admins can insert categorias" ON categorias;
CREATE POLICY "Admins can insert categorias"
  ON categorias FOR INSERT
  WITH CHECK (get_my_role() = 'admin');

-- ── Productos ──
DROP POLICY IF EXISTS "Authenticated users can read productos" ON productos;
CREATE POLICY "Authenticated users can read productos"
  ON productos FOR SELECT
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admin and inventario can insert productos" ON productos;
CREATE POLICY "Admin and inventario can insert productos"
  ON productos FOR INSERT
  WITH CHECK (get_my_role() IN ('admin', 'inventario'));

DROP POLICY IF EXISTS "Admin and inventario can update productos" ON productos;
CREATE POLICY "Admin and inventario can update productos"
  ON productos FOR UPDATE
  USING (get_my_role() IN ('admin', 'inventario'));

-- ── Ventas ──
DROP POLICY IF EXISTS "Authenticated users can read ventas" ON ventas;
CREATE POLICY "Authenticated users can read ventas"
  ON ventas FOR SELECT
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admin and cajero can insert ventas" ON ventas;
CREATE POLICY "Admin and cajero can insert ventas"
  ON ventas FOR INSERT
  WITH CHECK (get_my_role() IN ('admin', 'cajero'));

-- ── Detalle Ventas ──
DROP POLICY IF EXISTS "Authenticated users can read detalle_ventas" ON detalle_ventas;
CREATE POLICY "Authenticated users can read detalle_ventas"
  ON detalle_ventas FOR SELECT
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admin and cajero can insert detalle_ventas" ON detalle_ventas;
CREATE POLICY "Admin and cajero can insert detalle_ventas"
  ON detalle_ventas FOR INSERT
  WITH CHECK (get_my_role() IN ('admin', 'cajero'));

-- ── Perfiles ──
DROP POLICY IF EXISTS "Users can read own profile" ON perfiles;
CREATE POLICY "Users can read own profile"
  ON perfiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can read all profiles" ON perfiles;
CREATE POLICY "Admins can read all profiles"
  ON perfiles FOR SELECT
  USING (get_my_role() = 'admin');

DROP POLICY IF EXISTS "Admins can insert profiles" ON perfiles;
CREATE POLICY "Admins can insert profiles"
  ON perfiles FOR INSERT
  WITH CHECK (get_my_role() = 'admin');

DROP POLICY IF EXISTS "Admins can update profiles" ON perfiles;
CREATE POLICY "Admins can update profiles"
  ON perfiles FOR UPDATE
  USING (get_my_role() = 'admin');
