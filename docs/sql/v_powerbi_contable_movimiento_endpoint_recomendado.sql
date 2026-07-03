-- Consulta recomendada para el endpoint único de reportería contable.
-- El frontend NO consulta la base de datos; esta consulta es para que el backend
-- exponga metadata + movimientos desde la view contabilidad.v_powerbi_contable_movimiento.

-- Parámetros esperados:
-- :desde       date  -- periodo visual para Libro Diario, Mayor, EE.RR. y Flujo
-- :hasta       date  -- periodo visual para Libro Diario, Mayor, EE.RR. y Flujo
-- :fecha_corte date  -- corte acumulado para Balance y saldos iniciales

WITH movimientos AS (
  SELECT *
  FROM contabilidad.v_powerbi_contable_movimiento
  WHERE fecha_transaccion::date <= :fecha_corte::date
  ORDER BY fecha_transaccion ASC, id_transaccion ASC, id_movimiento ASC
), cuentas_efectivo AS (
  SELECT DISTINCT
    id_cuenta AS "idCuenta",
    codigo AS "codigoCuenta",
    nombre_cuenta AS "nombreCuenta"
  FROM contabilidad.cuenta
  WHERE codigo IN ('1.1.01.001', '1.1.01.002', '1.1.01.003', '1.1.01.013')
)
SELECT json_build_object(
  'metadata', json_build_object(
    'generadoEn', now(),
    'origen', 'contabilidad.v_powerbi_contable_movimiento',
    'desde', :desde::date,
    'hasta', :hasta::date,
    'fechaCorte', :fecha_corte::date,
    'moneda', 'BOB',
    'cuentasEfectivo', COALESCE((SELECT json_agg(cuentas_efectivo) FROM cuentas_efectivo), '[]'::json)
  ),
  'movimientos', COALESCE((SELECT json_agg(movimientos) FROM movimientos), '[]'::json)
) AS response;

-- Importante:
-- 1. No filtrar movimientos por :desde y :hasta en SQL principal.
-- 2. El frontend filtra visualmente el periodo con esos campos.
-- 3. El Balance General necesita acumulado hasta :fecha_corte.
-- 4. El Flujo de Caja necesita movimientos antes de :desde para calcular saldo inicial.
