# Reportería contable CPA

Aplicación web para consulta de reportes contables del Centro de Preparación Académica.

## Reportes incluidos

- Libro Diario
- Libro Mayor
- Estado de Resultados
- Balance General
- Flujo de Caja

## Uso

1. Ingresar con el usuario autorizado.
2. Entrar al Panel de reportería.
3. Abrir el área Contabilidad.
4. Seleccionar el rango de fechas o la fecha de corte.
5. Aplicar filtros contables cuando corresponda.
6. Revisar el reporte en pantalla.
7. Exportar o imprimir el reporte.

## Preparación local

```bash
yarn install
yarn dev
```

La aplicación abre en:

```txt
http://localhost:4173
```

## Configuración

Crear un archivo `.env` tomando como base `.env.example`:

```env
VITE_SERVICIO_CONTABLE_URL=http://localhost:3000
VITE_RUTA_ACCESO=/api/auth/publicAuth/login
VITE_RUTA_REPORTERIA=/api/reporteria/contabilidad/powerbi-movimientos
```


## Accesos por usuario

Después de iniciar sesión, el sistema revisa los accesos devueltos para mostrar únicamente las áreas y reportes habilitados.

- Acceso general recomendado para Contabilidad: `REPORTERIA.CONTABILIDAD.READ`.
- También se soportan accesos específicos por reporte.
- El detalle para conciliarlo con el servicio de usuarios está en `docs/CONCILIACION_PERMISOS_REPORTERIA.md`.

## Entrega para producción

```bash
yarn quality
```

El resultado listo para publicar queda en la carpeta:

```txt
dist/
```

## Criterio visual final

- Pantallas limpias y sobrias.
- Textos orientados a contador y usuario final.
- Sin mensajes técnicos en la interfaz.
- Panel inicial para organizar áreas de reportería.
- Reportes con estructura desplegable.
- Balance General en formato de árbol: subgrupo, grupo de cuenta y cuenta contable.
- Impresión en cascada clásica, minimalista y legible.
