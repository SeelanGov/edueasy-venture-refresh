-- Supabase schema dump query
-- This query extracts table schema information excluding system tables
-- Run this in the SQL Editor or via Supabase CLI when connected to your database

SELECT 
    table_schema, 
    table_name, 
    column_name, 
    data_type,
    ordinal_position,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
ORDER BY table_schema, table_name, ordinal_position;

-- Alternative: If you need more detailed column information
-- SELECT 
--     c.table_schema,
--     c.table_name,
--     c.column_name,
--     c.data_type,
--     c.character_maximum_length,
--     c.numeric_precision,
--     c.numeric_scale,
--     c.is_nullable,
--     c.column_default,
--     c.ordinal_position
-- FROM information_schema.columns c
-- JOIN information_schema.tables t 
--     ON c.table_schema = t.table_schema 
--     AND c.table_name = t.table_name
-- WHERE c.table_schema NOT IN ('information_schema', 'pg_catalog')
--     AND t.table_type = 'BASE TABLE'
-- ORDER BY c.table_schema, c.table_name, c.ordinal_position;