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
2. Seleccionar el rango de fechas o la fecha de corte.
3. Aplicar filtros contables cuando corresponda.
4. Revisar el reporte en pantalla.
5. Exportar o imprimir el reporte.

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
- Reportes con estructura desplegable.
- Balance General en formato de árbol: subgrupo, grupo de cuenta y cuenta contable.
- Impresión en cascada clásica, minimalista y legible.
