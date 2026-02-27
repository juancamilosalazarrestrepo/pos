-- Helper function to get current user's role without recursion
-- Run this in the Supabase SQL Editor
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS text AS $$
DECLARE
  mi_rol text;
BEGIN
  SELECT rol INTO mi_rol FROM perfiles WHERE id = auth.uid();
  RETURN mi_rol;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
