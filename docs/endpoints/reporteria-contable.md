# Contrato final - Frontend Reportería Contable CPA

## Regla central

El frontend consume únicamente API real:

- Login real.
- Token por `X-Session-Token`.
- Un único endpoint especializado de reportería.
- Sin mocks.
- Sin datos demo.
- Sin CRUD administrativo.

## Login

```http
POST /api/auth/publicAuth/login
Content-Type: application/json
Accept: application/json
```

La petición de login no debe recibir `X-Session-Token`.

Body:

```json
{
  "email": "usuario@dominio.com",
  "password": "contraseña"
}
```

Respuesta mínima compatible:

```json
{
  "success": true,
  "data": {
    "sessionToken": "TOKEN",
    "user": {
      "email": "usuario@dominio.com",
      "nombre_usuario": "Usuario"
    }
  }
}
```

## Endpoint único de reportería

```http
GET /api/reporteria/contabilidad/powerbi-movimientos?desde=YYYY-MM-DD&hasta=YYYY-MM-DD&fechaCorte=YYYY-MM-DD&fecha_corte=YYYY-MM-DD&modo=acumulado&includeAcumulado=true&include_acumulado=true
X-Session-Token: <TOKEN>
```

El backend debe consultar directamente:

```sql
contabilidad.v_powerbi_contable_movimiento
```

## Respuesta obligatoria

```json
{
  "metadata": {
    "generadoEn": "2026-07-03T18:45:00.000Z",
    "origen": "contabilidad.v_powerbi_contable_movimiento",
    "desde": "2026-07-01",
    "hasta": "2026-07-31",
    "fechaCorte": "2026-07-31",
    "moneda": "BOB",
    "cuentasEfectivo": [
      {
        "idCuenta": 1,
        "codigoCuenta": "1.1.01.001",
        "nombreCuenta": "Caja moneda nacional"
      }
    ]
  },
  "movimientos": []
}
```

También se acepta `cuentaEfectivo` para una sola cuenta, pero se recomienda `cuentasEfectivo`.

## Cuentas de efectivo actuales

El frontend ya espera estas cuentas desde metadata:

```txt
1.1.01.001
1.1.01.002
1.1.01.003
1.1.01.013
```

## Regla crítica para no romper filtros

El backend debe devolver movimientos acumulados hasta `fechaCorte`:

```sql
WHERE fecha_transaccion::date <= :fecha_corte::date
```

No debe limitar el dataset principal por `desde/hasta`, porque:

- Libro Diario usa `desde/hasta` en frontend.
- Libro Mayor usa `desde/hasta` en frontend.
- Estado de Resultados usa `desde/hasta` en frontend.
- Balance General usa acumulado hasta `fechaCorte`.
- Flujo de Caja necesita saldo inicial antes de `desde`.

## Campos esperados por movimiento

```txt
id_transaccion
id_movimiento
fecha_transaccion
periodo_inicio
periodo_fin
anio
mes
tipo_transaccion
sub_tipo_transaccion
glosa
id_cuenta
codigo_cuenta
nombre_cuenta
id_grupo_cuenta
codigo_grupo_cuenta
nombre_grupo_cuenta
tipo_reporte
sub_tipo
sub_grupo
orden_reporte
debe
haber
saldo_deudor
saldo_natural
naturaleza_saldo
```

## Filtros del frontend

Los filtros avanzados se aplican sobre los movimientos cargados desde la view y no llaman CRUD:

- Año.
- Mes.
- Tipo transacción.
- Subtipo transacción.
- Tipo reporte.
- Clasificación contable.
- Código cuenta.
- Nombre cuenta.
- ID cuenta.
- Código grupo.
- Nombre grupo.
- ID grupo.
- Subgrupo.
- Naturaleza.
- Transacción.
- Movimiento.
- Búsqueda general.

Los filtros se aplican con pausa breve para evitar comportamiento brusco.
