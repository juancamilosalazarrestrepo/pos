# Database — POS System

Scripts SQL para crear y configurar la base de datos en Supabase.

## Orden de Ejecución

Ejecutar en el **SQL Editor** de Supabase en este orden:

| # | Archivo | Descripción |
|---|---------|-------------|
| 1 | `001_tables.sql` | Crea todas las tablas (categorias, productos, ventas, detalle_ventas, perfiles) |
| 2 | `002_rls_policies.sql` | Políticas de Row Level Security por rol |
| 3 | `003_triggers.sql` | Trigger para auto-crear perfil al registrar usuario |
| 4 | `004_seed.sql` | Datos de ejemplo (10 categorías, 18 productos) |

## Diagrama de Relaciones

```
auth.users (Supabase Auth)
    │
    └──► perfiles (id = auth.users.id)
            • nombre, email, rol, activo

categorias
    │
    └──► productos (categoria_id → categorias.id)
            • sku, nombre, precio_venta, stock_actual

ventas
    │
    └──► detalle_ventas (venta_id → ventas.id)
            • producto_id → productos.id
            • cantidad, precio_unitario
```

## Roles

| Rol | categorias | productos | ventas | detalle_ventas | perfiles |
|-----|-----------|-----------|--------|----------------|----------|
| `admin` | R/W | R/W | R/W | R/W | R/W |
| `cajero` | R | R | R/W | R/W | Own only |
| `inventario` | R | R/W | R | R | Own only |

## Notas

- Los precios se almacenan en **pesos colombianos (COP)** como `NUMERIC`.
- El campo `rol` en `perfiles` usa un `CHECK` constraint: `admin`, `cajero`, `inventario`.
- El trigger `handle_new_user` crea automáticamente un perfil con rol `cajero` al registrarse.
- Para crear el primer usuario admin, registra un usuario normalmente y luego actualiza su rol manualmente:

```sql
UPDATE perfiles SET rol = 'admin' WHERE email = 'tu-email@ejemplo.com';
```
