-- ===========================================
-- TEST SCRIPT - Verificar funcionamiento del sistema de lealtad
-- Ejecutar en Supabase SQL Editor después de implementar el schema
-- ===========================================

-- 1. Verificar que las tablas existen
SELECT 'customer_loyalty table exists' as check_result
WHERE EXISTS (SELECT 1 FROM information_schema.tables
              WHERE table_schema = 'public' AND table_name = 'customer_loyalty');

SELECT 'service_discount_config table exists' as check_result
WHERE EXISTS (SELECT 1 FROM information_schema.tables
              WHERE table_schema = 'public' AND table_name = 'service_discount_config');

-- 2. Verificar configuraciones de descuento
SELECT 'Global discount configs count' as description, COUNT(*) as count
FROM service_discount_config WHERE user_id IS NULL;

-- 3. Verificar funciones existen
SELECT 'add_loyalty_points function exists' as check_result
WHERE EXISTS (SELECT 1 FROM information_schema.routines
              WHERE routine_schema = 'public' AND routine_name = 'add_loyalty_points');

SELECT 'get_customer_completed_services function exists' as check_result
WHERE EXISTS (SELECT 1 FROM information_schema.routines
              WHERE routine_schema = 'public' AND routine_name = 'get_customer_completed_services');

-- 4. Probar función add_loyalty_points (usando un usuario existente)
-- Reemplaza 'user-uuid-here' con un UUID real de tu tabla users
/*
SELECT add_loyalty_points('user-uuid-here', 'Limpieza de casas', 10);
SELECT * FROM customer_loyalty WHERE user_id = 'user-uuid-here';
*/

-- 5. Verificar permisos de funciones
SELECT 'Function permissions granted' as check_result
WHERE EXISTS (
    SELECT 1 FROM information_schema.role_routine_grants
    WHERE routine_schema = 'public'
    AND routine_name IN ('add_loyalty_points', 'get_customer_completed_services', 'get_customer_discounts')
    AND grantee = 'authenticated'
);

-- 6. Verificar RLS policies
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('customer_loyalty', 'service_discount_config')
ORDER BY tablename, policyname;

-- ===========================================
-- QUERIES DE DEBUGGING
-- =========================================--

-- Ver todos los servicios completados por usuario
-- SELECT us.user_id, u.name, us.service_name, COUNT(*) as completed_count
-- FROM user_services us
-- JOIN users u ON us.user_id = u.id
-- WHERE us.status = 'completed'
-- GROUP BY us.user_id, u.name, us.service_name
-- ORDER BY u.name, us.service_name;

-- Ver puntos de lealtad por usuario
-- SELECT cl.user_id, u.name, cl.service_type, cl.points
-- FROM customer_loyalty cl
-- JOIN users u ON cl.user_id = u.id
-- ORDER BY u.name, cl.service_type;

-- Ver descuentos disponibles para un usuario específico
-- SELECT * FROM get_customer_discounts('user-uuid-here');

-- Ver servicios completados para un usuario específico
-- SELECT * FROM get_customer_completed_services('user-uuid-here');

-- ===========================================
-- TEST COMPLETE
-- =========================================--