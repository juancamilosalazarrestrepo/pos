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
CREATE POLICY "Authenticated users can read categorias"
  ON categorias FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can insert categorias"
  ON categorias FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol = 'admin')
  );

-- ── Productos ──
CREATE POLICY "Authenticated users can read productos"
  ON productos FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin and inventario can insert productos"
  ON productos FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol IN ('admin', 'inventario'))
  );

CREATE POLICY "Admin and inventario can update productos"
  ON productos FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol IN ('admin', 'inventario'))
  );

-- ── Ventas ──
CREATE POLICY "Authenticated users can read ventas"
  ON ventas FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin and cajero can insert ventas"
  ON ventas FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol IN ('admin', 'cajero'))
  );

-- ── Detalle Ventas ──
CREATE POLICY "Authenticated users can read detalle_ventas"
  ON detalle_ventas FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin and cajero can insert detalle_ventas"
  ON detalle_ventas FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol IN ('admin', 'cajero'))
  );

-- ── Perfiles ──
CREATE POLICY "Users can read own profile"
  ON perfiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON perfiles FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol = 'admin')
  );

CREATE POLICY "Admins can insert profiles"
  ON perfiles FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol = 'admin')
  );

CREATE POLICY "Admins can update profiles"
  ON perfiles FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol = 'admin')
  );
