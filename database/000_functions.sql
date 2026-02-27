-- Helper function to get current user's role without recursion
-- Run this in the Supabase SQL Editor
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS text AS $$
  SELECT rol FROM perfiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;
