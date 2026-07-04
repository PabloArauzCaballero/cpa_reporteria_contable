# Conciliación de accesos para reportería

## Objetivo

El ingreso al sistema debe devolver el token de sesión y la lista de accesos del usuario. Con esa información, el panel de reportería muestra únicamente las áreas y reportes habilitados.

## Respuesta esperada al iniciar sesión

La aplicación acepta cualquiera de estas formas, para adaptarse al contrato existente:

```json
{
  "data": {
    "sessionToken": "TOKEN",
    "user": {
      "email": "contador@cpa.test",
      "nombre_usuario": "Contador CPA",
      "permissions": [
        "REPORTERIA.CONTABILIDAD.READ"
      ]
    }
  }
}
```

También se aceptan los nombres `permisos`, `authorities`, `claims`, `roles` o `acciones`, y objetos con campos como `codigo`, `code`, `permiso`, `permission`, `clave`, `nombre` o `name`.

## Acceso general al área Contabilidad

Cualquiera de estos accesos habilita el área completa de Contabilidad:

```txt
REPORTERIA.CONTABILIDAD.READ
REPORTERIA.CONTABILIDAD.*
REPORTERIA.CONTABLE.READ
REPORTERIA.CONTABLE.*
CONTABILIDAD.REPORTERIA.READ
CONTABILIDAD.REPORTES.READ
CONTABILIDAD.*
```

## Accesos por reporte

### Libro diario

```txt
REPORTERIA.CONTABILIDAD.LIBRO_DIARIO.READ
REPORTERIA.CONTABILIDAD.DIARIO.READ
CONTABILIDAD.LIBRO_DIARIO.READ
CONTABILIDAD.TRANSACCION.READ
```

### Libro mayor

```txt
REPORTERIA.CONTABILIDAD.LIBRO_MAYOR.READ
REPORTERIA.CONTABILIDAD.MAYOR.READ
CONTABILIDAD.LIBRO_MAYOR.READ
CONTABILIDAD.CUENTA.READ
```

### Estado de resultados

```txt
REPORTERIA.CONTABILIDAD.ESTADO_RESULTADOS.READ
CONTABILIDAD.ESTADO_RESULTADOS.READ
```

### Balance general

```txt
REPORTERIA.CONTABILIDAD.BALANCE_GENERAL.READ
CONTABILIDAD.BALANCE_GENERAL.READ
CONTABILIDAD.GRUPO_CUENTA.READ
```

### Flujo de caja

```txt
REPORTERIA.CONTABILIDAD.FLUJO_CAJA.READ
CONTABILIDAD.FLUJO_CAJA.READ
```

## Accesos administrativos globales

Estos códigos habilitan todas las opciones:

```txt
ADMIN
SUPER_ADMIN
ROOT
SYSTEM.ADMIN
SISTEMA.ADMIN
ADMINISTRADOR
```

## Comportamiento esperado en pantalla

- Si el usuario tiene acceso a Contabilidad, aparece la tarjeta Contabilidad en el panel.
- Si solo tiene acceso a algunos reportes, dentro de Contabilidad solo aparecen esas pestañas.
- Si no tiene reportes asignados, el panel muestra una indicación para solicitar habilitación.
- El menú lateral no muestra Contabilidad cuando el usuario no tiene acceso.
