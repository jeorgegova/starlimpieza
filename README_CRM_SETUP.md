# 🚀 Configuración del Sistema CRM - Supabase

Este documento explica cómo configurar la base de datos CRM para el sistema de fidelidad de clientes.

## 📋 Requisitos Previos

- Cuenta activa en [Supabase](https://supabase.com)
- Proyecto creado en Supabase
- Acceso al SQL Editor de Supabase

## 🗄️ Estructura de la Base de Datos

### Tablas Utilizadas

1. **`users`** (existente) - Usuarios del sistema
2. **`user_services`** (existente) - Reservas/servicios
3. **`customer_loyalty`** (nueva) - Puntos de fidelidad

## 📝 Pasos de Instalación

### ⚠️ **Nota Importante**
Este CRM utiliza **operaciones directas** desde el cliente en lugar de funciones RPC para evitar problemas de seguridad RLS. Las políticas están configuradas para permitir operaciones directas desde usuarios admin autenticados.

### Paso 1: Crear la Tabla de Fidelidad

Ve al **SQL Editor** de Supabase y ejecuta el siguiente código:

```sql
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
```

### Paso 2: Crear Función para Actualizar Timestamps

```sql
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
```

### Paso 3: Configurar Políticas de Seguridad (RLS)

```sql
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

-- Política para que los admins puedan insertar registros
CREATE POLICY "Admins can insert loyalty records" ON public.customer_loyalty
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Política para que los admins puedan actualizar registros
CREATE POLICY "Admins can update loyalty records" ON public.customer_loyalty
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Política para que los admins puedan eliminar registros (si es necesario)
CREATE POLICY "Admins can delete loyalty records" ON public.customer_loyalty
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );
```

### Paso 4: Crear Función para Agregar Puntos

```sql
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
```

### Paso 5: Crear Función para Obtener Nivel VIP

```sql
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
```

### Paso 6: Crear Vistas Útiles (Opcional)

```sql
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
```

## 🔧 Configuración del Proyecto

### 1. Instalar Dependencias

Asegúrate de tener todas las dependencias instaladas:

```bash
npm install
```

### 2. Configurar Supabase

Actualiza tu archivo `src/supabaseClient.js` con las credenciales correctas de tu proyecto Supabase.

### 3. Ejecutar la Aplicación

```bash
npm run dev
```

## 🎯 Funcionalidades del CRM

### Sistema de Puntos de Fidelidad

- **Automático**: Se agregan puntos automáticamente al completar servicios
- **Manual**: Los administradores pueden agregar puntos extra
- **Por Servicio**: Diferentes puntos según el tipo de servicio

### Sistema de Descuentos por Servicios Completados

- **Configurable**: Los administradores pueden configurar descuentos por servicio
- **Por Tipo de Servicio**: Descuentos específicos para cada tipo de servicio
- **Acumulativo**: El descuento más alto disponible se aplica automáticamente
- **Ejemplos**:
  - Limpieza de casas: 5% después de 3 servicios, 10% después de 5, 15% después de 10
  - Turismo & Airbnb: 5% después de 2 servicios, 10% después de 5, 15% después de 8

### Niveles VIP

- **Cliente Regular**: 0-24 puntos (0% descuento)
- **VIP Bronce**: 25-49 puntos (5% descuento)
- **VIP Plata**: 50-99 puntos (10% descuento)
- **VIP Oro**: 100+ puntos (15% descuento)

### Gestión de Clientes

- **Historial Completo**: Todos los servicios realizados por cliente
- **Estado de Servicios**: Pendiente → Confirmado → Completado
- **Información Detallada**: Fechas, ubicaciones, teléfonos, etc.
- **Descuentos Disponibles**: Visualización clara de bonificaciones activas
- **Reportes Detallados**: Estadísticas completas por cliente

### Vista de Usuario - Bonificaciones

- **Panel de Bonificaciones**: Los usuarios ven sus descuentos disponibles con progreso visual
- **Barra de Progreso**: Indicador visual del progreso hacia próximos descuentos
- **Descuentos Desbloqueados**: Bonificaciones activas claramente destacadas
- **Próximos Descuentos**: Información integrada sobre próximos niveles a alcanzar
- **Nivel VIP**: Visualización atractiva del nivel de fidelidad
- **Descuentos en Reserva**: Se muestran automáticamente al hacer reservas

## 📊 Consultas Útiles para Reportes

### Total de puntos por cliente
```sql
SELECT * FROM customer_loyalty_totals ORDER BY total_points DESC;
```

### Estadísticas por servicio
```sql
SELECT * FROM loyalty_service_stats ORDER BY total_points DESC;
```

### Puntos de un cliente específico
```sql
SELECT service_type, points FROM customer_loyalty
WHERE user_id = 'cliente-uuid' ORDER BY points DESC;
```

## 🔒 Seguridad

- **RLS Activado**: Row Level Security protege los datos
- **Políticas de Acceso**: Solo admins pueden gestionar puntos de fidelidad
- **Usuarios solo ven sus propios puntos**
- **Validaciones**: Puntos no pueden ser negativos

## 🚀 Próximos Pasos

1. **Reportes Avanzados**: Crear dashboards con métricas de fidelidad
2. **Notificaciones**: Alertas cuando clientes alcanzan nuevos niveles VIP
3. **Promociones**: Sistema de ofertas basado en niveles de fidelidad
4. **API de Descuentos**: Integración con sistemas de pago externos

## 📋 Guía de Uso

### Para Administradores

#### Configurar Descuentos por Servicio
1. Ve a la pestaña **"CRM Clientes"**
2. En la sección **"Configuración de Descuentos"**, haz clic en **"Nueva Configuración"**
3. Selecciona el servicio, cantidad de servicios requeridos y porcentaje de descuento
4. Los descuentos se aplican automáticamente al cliente que cumpla los requisitos

#### Gestionar Clientes
1. Selecciona un cliente de la lista
2. Revisa su historial completo de servicios
3. Ve los descuentos disponibles y próximos
4. Agrega puntos de fidelidad manualmente si es necesario

### Para Usuarios

#### Ver Bonificaciones
1. Inicia sesión como usuario
2. Ve a la pestaña **"Bonificaciones"**
3. Visualiza tu nivel VIP actual
4. Ve el progreso de cada servicio con barras visuales
5. Identifica descuentos ya desbloqueados (verde) vs próximos (azul)
6. Revisa cuántos servicios faltan para el siguiente descuento

## 🔧 Funciones de Base de Datos

### Funciones RPC Disponibles

- **`get_customer_discounts(p_user_id uuid)`** - Obtiene descuentos desbloqueados por cliente
- **`get_customer_completed_services(p_user_id uuid)`** - Obtiene conteo total de servicios completados por tipo
- **`get_service_discount(p_user_id uuid, p_service_type text)`** - Calcula descuento aplicable para un servicio
- **`add_loyalty_points(p_user_id uuid, p_service_type text, p_points integer)`** - Agrega puntos de fidelidad
- **`get_customer_vip_tier(p_user_id uuid)`** - Obtiene nivel VIP del cliente

## 🎯 Configuración de Descuentos

### Opción 1: Descuentos Globales (Actual)
Los descuentos se aplican a **todos los usuarios** por igual:
- Limpieza de casas: 5% (3 servicios), 10% (5 servicios), 15% (10 servicios)
- Turismo & Airbnb: 5% (2 servicios), 10% (5 servicios), 15% (8 servicios)
- **Ventaja**: Fácil de gestionar, reglas claras para todos
- **Desventaja**: No se puede personalizar por cliente

### Opción 2: Descuentos Personalizados (Opcional)
Si quieres descuentos **personalizados por usuario**, ejecuta este SQL adicional:

```sql
-- Agregar columna user_id a la tabla de configuración
ALTER TABLE public.service_discount_config ADD COLUMN user_id uuid REFERENCES public.users(id);

-- Actualizar políticas RLS para permitir configuración por usuario
-- (Se requerirían modificaciones adicionales en las funciones)
```

**Ventaja**: Puedes ofrecer descuentos especiales a clientes VIP
**Desventaja**: Más complejo de gestionar

### ¿Cuál Elegir?
- **Global**: Para la mayoría de los negocios (recomendado)
- **Personalizado**: Para negocios con clientes muy especiales o programas de fidelidad avanzados

#### Aplicar Descuentos en Reservas
1. Al hacer una reserva, el sistema calcula automáticamente tu descuento disponible
2. Se muestra claramente en el modal de reserva
3. El descuento se aplica al precio final del servicio

## 🆘 Solución de Problemas

### Error: "new row violates row-level security policy for table 'customer_loyalty'"
- **Causa**: Las políticas RLS no permiten operaciones desde funciones RPC
- **Solución**: Asegúrate de haber ejecutado las políticas RLS actualizadas (INSERT, UPDATE, DELETE separadas)
- **Verificación**: Las operaciones ahora se hacen directamente desde el cliente, no desde RPC

### Error: "function add_loyalty_points(uuid, text, integer) does not exist"
- Asegúrate de haber ejecutado el Paso 4 correctamente
- Verifica que la función se creó en el schema `public`
- **Nota**: Esta función ya no se usa en la implementación actual (se hacen operaciones directas)

### Error: "permission denied for table customer_loyalty"
- Verifica que las políticas RLS estén configuradas correctamente
- Asegúrate de que el usuario tenga permisos de admin
- Confirma que estás autenticado como admin en la aplicación

### Los puntos no se actualizan automáticamente
- Verifica que el servicio se marque como "completado" correctamente
- Revisa los logs de la aplicación para errores de red
- Confirma que la tabla `customer_loyalty` existe y las políticas están activas

---

¡Tu sistema CRM está listo! 🎉