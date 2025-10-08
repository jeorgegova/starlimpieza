-- ===========================================
-- CRM LOYALTY SYSTEM - SUPABASE SCHEMA
-- ===========================================

-- Tabla para almacenar puntos de fidelidad por cliente y tipo de servicio
CREATE TABLE IF NOT EXISTS public.customer_loyalty (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  user_id uuid NOT NULL,
  service_type text NOT NULL,
  points integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),

  CONSTRAINT customer_loyalty_pkey PRIMARY KEY (id),
  CONSTRAINT customer_loyalty_user_service_unique UNIQUE (user_id, service_type),
  CONSTRAINT customer_loyalty_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT customer_loyalty_points_check CHECK (points >= 0)
) TABLESPACE pg_default;

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_customer_loyalty_user_id ON public.customer_loyalty(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_loyalty_service_type ON public.customer_loyalty(service_type);

-- Función para actualizar automáticamente updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_customer_loyalty_updated_at
    BEFORE UPDATE ON public.customer_loyalty
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- POLÍTICAS DE SEGURIDAD (RLS)
-- ===========================================

-- Habilitar RLS en la tabla
ALTER TABLE public.customer_loyalty ENABLE ROW LEVEL SECURITY;

-- Política para que los admins puedan ver todos los registros
CREATE POLICY "Admins can view all loyalty records" ON public.customer_loyalty
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Política para que los usuarios puedan ver solo sus propios registros
CREATE POLICY "Users can view own loyalty records" ON public.customer_loyalty
    FOR SELECT USING (user_id = auth.uid());

-- Política para que los admins puedan insertar/editar todos los registros
CREATE POLICY "Admins can manage all loyalty records" ON public.customer_loyalty
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- ===========================================
-- DATOS INICIALES DE EJEMPLO
-- ===========================================

-- Insertar algunos registros de ejemplo (opcional)
-- Estos se generarían automáticamente cuando se complete un servicio
/*
INSERT INTO public.customer_loyalty (user_id, service_type, points) VALUES
('user-uuid-1', 'Limpieza de casas', 25),
('user-uuid-1', 'Turismo & Airbnb', 15),
('user-uuid-2', 'Limpieza de casas', 50);
*/

-- ===========================================
-- VISTAS ÚTILES PARA REPORTES
-- ===========================================

-- Vista para obtener el total de puntos por cliente
CREATE OR REPLACE VIEW public.customer_loyalty_totals AS
SELECT
    cl.user_id,
    u.name,
    u.username,
    u.email,
    SUM(cl.points) as total_points,
    COUNT(cl.service_type) as services_count,
    MAX(cl.updated_at) as last_activity
FROM public.customer_loyalty cl
JOIN public.users u ON cl.user_id = u.id
WHERE u.role = 'user'
GROUP BY cl.user_id, u.name, u.username, u.email;

-- Vista para obtener estadísticas por tipo de servicio
CREATE OR REPLACE VIEW public.loyalty_service_stats AS
SELECT
    service_type,
    COUNT(DISTINCT user_id) as unique_customers,
    SUM(points) as total_points,
    AVG(points) as avg_points_per_customer
FROM public.customer_loyalty
GROUP BY service_type;

-- ===========================================
-- FUNCIONES ÚTILES
-- ===========================================

-- Función para agregar puntos de fidelidad automáticamente
CREATE OR REPLACE FUNCTION add_loyalty_points(
    p_user_id uuid,
    p_service_type text,
    p_points integer DEFAULT 0
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    calculated_points integer;
BEGIN
    -- Calcular puntos automáticamente basado en el tipo de servicio
    CASE
        WHEN p_service_type = 'Limpieza de casas' THEN calculated_points := 10;
        ELSE calculated_points := 5;
    END CASE;

    -- Si se especifican puntos manualmente, usar esos
    IF p_points > 0 THEN
        calculated_points := p_points;
    END IF;

    -- Insertar o actualizar puntos
    INSERT INTO public.customer_loyalty (user_id, service_type, points)
    VALUES (p_user_id, p_service_type, calculated_points)
    ON CONFLICT (user_id, service_type)
    DO UPDATE SET
        points = customer_loyalty.points + calculated_points,
        updated_at = now();
END;
$$;

-- Función para obtener el nivel VIP de un cliente
CREATE OR REPLACE FUNCTION get_customer_vip_tier(p_user_id uuid)
RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
    total_points integer;
    tier_info json;
BEGIN
    -- Obtener total de puntos del cliente
    SELECT COALESCE(SUM(points), 0) INTO total_points
    FROM public.customer_loyalty
    WHERE user_id = p_user_id;

    -- Determinar nivel VIP
    CASE
        WHEN total_points >= 100 THEN
            tier_info := '{"name": "VIP Oro", "color": "#FFD700", "discount": "15%"}'::json;
        WHEN total_points >= 50 THEN
            tier_info := '{"name": "VIP Plata", "color": "#C0C0C0", "discount": "10%"}'::json;
        WHEN total_points >= 25 THEN
            tier_info := '{"name": "VIP Bronce", "color": "#CD7F32", "discount": "5%"}'::json;
        ELSE
            tier_info := '{"name": "Cliente Regular", "color": "#6B7280", "discount": "0%"}'::json;
    END CASE;

    RETURN tier_info;
END;
$$;

-- ===========================================
-- COMENTARIOS Y NOTAS
-- ===========================================

COMMENT ON TABLE public.customer_loyalty IS 'Tabla para almacenar puntos de fidelidad de clientes por tipo de servicio';
COMMENT ON COLUMN public.customer_loyalty.user_id IS 'ID del cliente (referencia a users.id)';
COMMENT ON COLUMN public.customer_loyalty.service_type IS 'Tipo de servicio realizado';
COMMENT ON COLUMN public.customer_loyalty.points IS 'Puntos acumulados para este tipo de servicio';

COMMENT ON VIEW public.customer_loyalty_totals IS 'Vista que muestra el total de puntos y estadísticas por cliente';
COMMENT ON VIEW public.loyalty_service_stats IS 'Vista que muestra estadísticas de fidelidad por tipo de servicio';

COMMENT ON FUNCTION add_loyalty_points(uuid, text, integer) IS 'Función para agregar puntos de fidelidad automáticamente';
COMMENT ON FUNCTION get_customer_vip_tier(uuid) IS 'Función para obtener el nivel VIP de un cliente basado en sus puntos totales';

-- ===========================================
-- SERVICE DISCOUNT CONFIGURATION
-- ===========================================

-- Tabla para configurar descuentos por cantidad de servicios completados por tipo
CREATE TABLE IF NOT EXISTS public.service_discount_config (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  service_type text NOT NULL,
  services_required integer NOT NULL,
  discount_percentage decimal(5,2) NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),

  CONSTRAINT service_discount_config_pkey PRIMARY KEY (id),
  CONSTRAINT service_discount_config_user_service_unique UNIQUE (user_id, service_type, services_required),
  CONSTRAINT service_discount_config_services_required_check CHECK (services_required > 0),
  CONSTRAINT service_discount_config_discount_percentage_check CHECK (discount_percentage >= 0 AND discount_percentage <= 100)
) TABLESPACE pg_default;

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_service_discount_config_user_id ON public.service_discount_config(user_id);
CREATE INDEX IF NOT EXISTS idx_service_discount_config_service_type ON public.service_discount_config(service_type);
CREATE INDEX IF NOT EXISTS idx_service_discount_config_services_required ON public.service_discount_config(services_required);

-- Función para actualizar automáticamente updated_at
CREATE TRIGGER update_service_discount_config_updated_at
    BEFORE UPDATE ON public.service_discount_config
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Políticas de seguridad RLS
ALTER TABLE public.service_discount_config ENABLE ROW LEVEL SECURITY;

-- Solo admins pueden gestionar configuraciones de descuento
CREATE POLICY "Admins can manage discount configurations" ON public.service_discount_config
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Usuarios pueden ver sus propias configuraciones de descuento
CREATE POLICY "Users can view their own discount configurations" ON public.service_discount_config
    FOR SELECT USING (user_id = auth.uid());

-- Todos pueden leer las configuraciones globales (necesario para calcular descuentos)
CREATE POLICY "Everyone can read global discount configurations" ON public.service_discount_config
    FOR SELECT USING (user_id IS NULL);

-- ===========================================
-- FUNCTIONS FOR DISCOUNT CALCULATION
-- =========================================--

-- Función para obtener el descuento aplicable para un cliente y servicio
CREATE OR REPLACE FUNCTION get_service_discount(
    p_user_id uuid,
    p_service_type text
)
RETURNS decimal(5,2)
LANGUAGE plpgsql
AS $$
DECLARE
    completed_services integer;
    applicable_discount decimal(5,2) := 0;
BEGIN
    -- Contar servicios completados del mismo tipo
    SELECT COUNT(*) INTO completed_services
    FROM public.user_services
    WHERE user_id = p_user_id
    AND service_name = p_service_type
    AND status = 'completed';

    -- Obtener el descuento más alto aplicable
    SELECT COALESCE(MAX(discount_percentage), 0) INTO applicable_discount
    FROM public.service_discount_config
    WHERE service_type = p_service_type
    AND services_required <= completed_services;

    RETURN applicable_discount;
END;
$$;

-- Función para obtener todos los descuentos aplicables de un cliente
CREATE OR REPLACE FUNCTION get_customer_discounts(p_user_id uuid)
RETURNS TABLE (
    service_type text,
    completed_services bigint,
    discount_percentage decimal(5,2)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        sdc.service_type,
        COUNT(us.id) as completed_services,
        MAX(sdc.discount_percentage) as discount_percentage
    FROM public.service_discount_config sdc
    LEFT JOIN public.user_services us ON
        us.user_id = p_user_id
        AND us.service_name = sdc.service_type
        AND us.status = 'completed'
    WHERE sdc.user_id = p_user_id OR sdc.user_id IS NULL
    GROUP BY sdc.service_type, sdc.services_required
    HAVING COUNT(us.id) >= sdc.services_required
    ORDER BY sdc.service_type, MAX(sdc.discount_percentage) DESC;
END;
$$;

-- Función para obtener el conteo de servicios completados por tipo para un cliente
CREATE OR REPLACE FUNCTION get_customer_completed_services(p_user_id uuid)
RETURNS TABLE (
    service_type text,
    completed_count bigint
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        us.service_name as service_type,
        COUNT(us.id) as completed_count
    FROM public.user_services us
    WHERE us.user_id = p_user_id
    AND us.status = 'completed'
    GROUP BY us.service_name
    ORDER BY us.service_name;
END;
$$;

-- ===========================================
-- INITIAL DISCOUNT CONFIGURATIONS
-- =========================================--

-- Insertar configuraciones de descuento globales por defecto
INSERT INTO public.service_discount_config (user_id, service_type, services_required, discount_percentage) VALUES
(NULL, 'Limpieza de casas', 3, 5.00),
(NULL, 'Limpieza de casas', 5, 10.00),
(NULL, 'Limpieza de casas', 10, 15.00),
(NULL, 'Turismo & Airbnb', 2, 5.00),
(NULL, 'Turismo & Airbnb', 5, 10.00),
(NULL, 'Turismo & Airbnb', 8, 15.00),
(NULL, 'Servicios Forestales', 3, 7.00),
(NULL, 'Servicios Forestales', 6, 12.00),
(NULL, 'Cristales Premium', 2, 5.00),
(NULL, 'Cristales Premium', 4, 10.00),
(NULL, 'Gestión de Terrenos', 2, 6.00),
(NULL, 'Gestión de Terrenos', 4, 12.00),
(NULL, 'Limpiezas de Garajes', 3, 5.00),
(NULL, 'Limpiezas de Garajes', 6, 10.00),
(NULL, 'Limpieza de Cocinas', 2, 5.00),
(NULL, 'Limpieza de Cocinas', 4, 10.00),
(NULL, 'Comunidades', 3, 8.00),
(NULL, 'Comunidades', 6, 15.00)
ON CONFLICT (user_id, service_type, services_required) DO NOTHING;

-- ===========================================
-- USEFUL VIEWS FOR REPORTS
-- =========================================--

-- Vista de resumen de fidelidad y descuentos por cliente
CREATE OR REPLACE VIEW public.customer_loyalty_summary AS
SELECT
    u.id as user_id,
    u.name,
    u.username,
    u.email,
    COALESCE(clt.total_points, 0) as total_points,
    COALESCE(clt.services_count, 0) as total_services_completed,
    json_agg(
        json_build_object(
            'service_type', cd.service_type,
            'completed_services', cd.completed_services,
            'discount_percentage', cd.discount_percentage
        )
    ) FILTER (WHERE cd.service_type IS NOT NULL) as available_discounts
FROM public.users u
LEFT JOIN public.customer_loyalty_totals clt ON clt.user_id = u.id
LEFT JOIN public.get_customer_discounts(u.id) cd ON true
WHERE u.role = 'user'
GROUP BY u.id, u.name, u.username, u.email, clt.total_points, clt.services_count;

-- ===========================================
-- COMMENTS
-- =========================================--

COMMENT ON TABLE public.service_discount_config IS 'Configuración de descuentos por cantidad de servicios completados';
COMMENT ON COLUMN public.service_discount_config.service_type IS 'Tipo de servicio';
COMMENT ON COLUMN public.service_discount_config.services_required IS 'Cantidad de servicios requeridos para obtener el descuento';
COMMENT ON COLUMN public.service_discount_config.discount_percentage IS 'Porcentaje de descuento aplicable';

COMMENT ON FUNCTION get_service_discount(uuid, text) IS 'Calcula el descuento aplicable para un cliente y servicio específico';
COMMENT ON FUNCTION get_customer_discounts(uuid) IS 'Obtiene todos los descuentos disponibles para un cliente';

COMMENT ON VIEW public.customer_loyalty_summary IS 'Vista completa de fidelidad y descuentos por cliente';

-- ===========================================
-- GRANT EXECUTE PERMISSIONS FOR RPC FUNCTIONS
-- =========================================--

GRANT EXECUTE ON FUNCTION get_customer_discounts(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_customer_completed_services(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_service_discount(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION get_customer_vip_tier(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION add_loyalty_points(uuid, text, integer) TO authenticated;