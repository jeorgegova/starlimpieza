# Sistema de Lealtad y Descuentos - Guía de Implementación

## Resumen
Este sistema implementa un completo programa de fidelización que otorga puntos por servicios completados y descuentos basados en la cantidad de servicios realizados.

## Componentes del Sistema

### 1. Tablas de Base de Datos
- `customer_loyalty`: Almacena puntos de fidelidad por usuario y tipo de servicio
- `service_discount_config`: Configura descuentos por cantidad de servicios completados

### 2. Funciones RPC
- `add_loyalty_points()`: Agrega puntos automáticamente al completar servicios
- `get_customer_completed_services()`: Obtiene conteo de servicios completados
- `get_customer_discounts()`: Calcula descuentos aplicables
- `get_service_discount()`: Obtiene descuento para un servicio específico
- `get_customer_vip_tier()`: Determina nivel VIP del cliente

## Pasos de Implementación

### Paso 1: Ejecutar el Schema Principal
1. Ve a Supabase → SQL Editor
2. Ejecuta el contenido completo de `database_schema.sql`
3. Esto creará todas las tablas, funciones y configuraciones iniciales

### Paso 2: Migrar Base de Datos Existente (si aplica)
Si ya tienes una base de datos con `service_discount_config` sin la columna `user_id`:
1. Ejecuta `database_migration.sql` en Supabase SQL Editor
2. Esto agregará la columna `user_id` y actualizará las políticas RLS

### Paso 3: Verificar la Implementación
1. **Puntos de Lealtad**: Al marcar un servicio como "completado", se agregan automáticamente:
   - 10 puntos por "Limpieza de casas"
   - 5 puntos por otros servicios

2. **Descuentos**: Se aplican automáticamente basados en servicios completados:
   - 3 servicios de "Limpieza de casas" = 5% descuento
   - 5 servicios = 10% descuento
   - 10 servicios = 15% descuento

3. **Niveles VIP**:
   - 25+ puntos = VIP Bronce (5% descuento general)
   - 50+ puntos = VIP Plata (10% descuento general)
   - 100+ puntos = VIP Oro (15% descuento general)

## Configuraciones Personalizadas por Usuario

### Descuentos Globales (por defecto)
```sql
-- Ya incluidos en el schema
INSERT INTO service_discount_config (user_id, service_type, services_required, discount_percentage)
VALUES (NULL, 'Limpieza de casas', 3, 5.00);
```

### Descuentos Específicos por Usuario
```sql
-- Para un usuario específico
INSERT INTO service_discount_config (user_id, service_type, services_required, discount_percentage)
VALUES ('user-uuid-here', 'Limpieza de casas', 2, 10.00);
```

## Verificación del Funcionamiento

### 1. Completar un Servicio
1. Ve a la vista de administración
2. Marca una reserva como "Completada"
3. Verifica que se agreguen puntos en `customer_loyalty`

### 2. Ver Barra de Progreso
1. Inicia sesión como usuario
2. Ve a la pestaña "Lealtad"
3. Verifica que la barra de progreso muestre servicios completados correctamente
4. La barra consulta directamente la tabla `user_services` para contar servicios con `status = 'completed'`

### 3. Ver Información en Admin
1. En la vista de administración, verás una nueva columna "Lealtad"
2. Muestra el nivel VIP y puntos totales de cada cliente

## Debugging

Si la barra de progreso muestra 0 servicios completados:

1. **Verifica el estado de los servicios**:
   ```sql
   SELECT service_name, status, COUNT(*) as count
   FROM user_services
   WHERE user_id = 'your-user-id'
   GROUP BY service_name, status;
   ```

2. **Verifica que los servicios estén marcados como 'completed'**:
   ```sql
   SELECT id, service_name, status, assigned_date
   FROM user_services
   WHERE user_id = 'your-user-id' AND status = 'completed'
   ORDER BY assigned_date DESC;
   ```

3. **Verifica puntos de lealtad**:
   ```sql
   SELECT * FROM customer_loyalty WHERE user_id = 'your-user-id';
   ```

4. **Revisa los logs de la consola del navegador** para ver los datos que se están consultando.

## Notas Importantes

- Los descuentos se calculan automáticamente al consultar `get_customer_discounts()`
- Los puntos se agregan solo cuando se cambia el estado a "completed" (no cuando ya está completado)
- Las configuraciones globales (`user_id = NULL`) aplican a todos los usuarios
- Las configuraciones específicas por usuario tienen prioridad sobre las globales

## Soporte

Si encuentras problemas:
1. Revisa los logs de la consola del navegador
2. Verifica que todas las funciones RPC tengan permisos de ejecución
3. Asegúrate de que RLS esté configurado correctamente