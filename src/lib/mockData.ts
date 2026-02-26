import { Producto } from './types';

/**
 * Seed data — used as fallback and for initial DB population.
 * After connecting to Supabase, you can run the seed SQL below
 * in the Supabase SQL Editor to populate the database.
 */

export const CATEGORIAS_SEED = [
    'Bebidas',
    'Snacks',
    'Lácteos',
    'Panadería',
    'Limpieza',
    'Cuidado Personal',
    'Enlatados',
    'Granos',
    'Frutas y Verduras',
    'Otros',
];

/*
-- SQL to seed categorias:

INSERT INTO categorias (nombre) VALUES
  ('Bebidas'), ('Snacks'), ('Lácteos'), ('Panadería'),
  ('Limpieza'), ('Cuidado Personal'), ('Enlatados'),
  ('Granos'), ('Frutas y Verduras'), ('Otros');

-- SQL to seed productos (run AFTER categorias exist):
-- Replace the categoria_id UUIDs with the actual IDs from your categorias table.
-- Or use a subquery:

INSERT INTO productos (sku, nombre, precio_venta, stock_actual, categoria_id) VALUES
  ('BEB-001', 'Coca-Cola 600ml', 2500, 48, (SELECT id FROM categorias WHERE nombre = 'Bebidas' LIMIT 1)),
  ('BEB-002', 'Agua Cristal 600ml', 1500, 60, (SELECT id FROM categorias WHERE nombre = 'Bebidas' LIMIT 1)),
  ('BEB-003', 'Jugo Hit Naranja 1L', 3500, 24, (SELECT id FROM categorias WHERE nombre = 'Bebidas' LIMIT 1)),
  ('SNK-001', 'Papas Margarita Natural', 2800, 36, (SELECT id FROM categorias WHERE nombre = 'Snacks' LIMIT 1)),
  ('SNK-002', 'Galletas Festival Chocolate', 2000, 5, (SELECT id FROM categorias WHERE nombre = 'Snacks' LIMIT 1)),
  ('LAC-001', 'Leche Alquería 1L', 4500, 20, (SELECT id FROM categorias WHERE nombre = 'Lácteos' LIMIT 1)),
  ('LAC-002', 'Yogurt Alpina Fresa', 2800, 3, (SELECT id FROM categorias WHERE nombre = 'Lácteos' LIMIT 1)),
  ('PAN-001', 'Pan Tajado Bimbo', 6500, 15, (SELECT id FROM categorias WHERE nombre = 'Panadería' LIMIT 1)),
  ('LIM-001', 'Jabón Fab 1000g', 7500, 2, (SELECT id FROM categorias WHERE nombre = 'Limpieza' LIMIT 1)),
  ('LIM-002', 'Cloro Blancox 1L', 4000, 10, (SELECT id FROM categorias WHERE nombre = 'Limpieza' LIMIT 1)),
  ('CUI-001', 'Shampoo Head & Shoulders', 12500, 8, (SELECT id FROM categorias WHERE nombre = 'Cuidado Personal' LIMIT 1)),
  ('ENL-001', 'Atún Van Camps', 5500, 25, (SELECT id FROM categorias WHERE nombre = 'Enlatados' LIMIT 1)),
  ('GRA-001', 'Arroz Diana 1kg', 4500, 30, (SELECT id FROM categorias WHERE nombre = 'Granos' LIMIT 1)),
  ('GRA-002', 'Lentejas La Muñeca 500g', 4200, 4, (SELECT id FROM categorias WHERE nombre = 'Granos' LIMIT 1)),
  ('FRU-001', 'Banano (lb)', 1500, 40, (SELECT id FROM categorias WHERE nombre = 'Frutas y Verduras' LIMIT 1)),
  ('BEB-004', 'Cerveza Poker 330ml', 2800, 0, (SELECT id FROM categorias WHERE nombre = 'Bebidas' LIMIT 1)),
  ('SNK-003', 'Chocolatina Jet', 1800, 50, (SELECT id FROM categorias WHERE nombre = 'Snacks' LIMIT 1)),
  ('OTR-001', 'Pilas Duracell AA x2', 6500, 12, (SELECT id FROM categorias WHERE nombre = 'Otros' LIMIT 1));
*/
