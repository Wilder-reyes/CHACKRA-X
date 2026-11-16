# Validación de CHACKRA X

## Resultado de la versión

- TypeScript y Vite: compilación correcta.
- Frontend: 44 pruebas aprobadas.
- API y ciencia: 276 pruebas aprobadas.
- Navegador: 4 pruebas aprobadas, con API real.
- Modelo HLS: reproducción verificada.
- Auditoría estática: sin credenciales detectadas, imports locales rotos ni errores de sintaxis Python.

## Comprobaciones

- Instalación de dependencias, TypeScript y compilación Vite.
- Pruebas unitarias de configuración, geometría, calendario, datos ausentes y planificación por zonas.
- Pruebas de API y servicios científicos.
- Reproducción del modelo estacional NASA HLS: observaciones, coeficientes y evaluación cronológica.
- Navegador: bienvenida y tutorial, registro de tres polígonos con el mismo cultivo y mes, respuesta real de la API, manejo de errores, recuperación de un terreno fuera de Barranca y PDF.
- Anchos de pantalla: 320, 360, 375, 390, 430, 640, 768, 820, 960, 1024 y 1280 píxeles.
- Límites de zoom nativo para evitar solicitudes cartográficas por encima de la disponibilidad configurada.

## Comandos

```sh
cd frontend
npm ci
npm test
npm run build
npm run test:e2e
```

```sh
PYTHONPATH=backend python -m unittest discover -s tests -p 'test_*.py'
python scripts/reproduce_field_shift_ai.py --check
```

## Alcance

La validación automatizada utiliza Chromium y tamaños de pantalla emulados. La compatibilidad nativa para compartir archivos y el envío efectivo por WhatsApp requieren comprobación en un dispositivo compatible. La alternativa manual indica expresamente que el archivo aún no ha sido enviado.

La conectividad de la API se comprueba en `/api/health`; la ruta raíz no es un indicador de salud. El proxy de producción permite las consultas desde el mismo origen sin ampliar la política CORS del servidor científico.

El registro de proveedores no certifica la adquisición de todos sus productos. La climatología regional no equivale a mediciones dentro del terreno. El modelo HLS no identifica cultivos ni predice cosechas.

Los polígonos deben ser válidos, quedar dentro del terreno y no superponerse. La superficie de cada zona es aproximada. Los meses sin programación no se presentan como descansos planificados.

La comparación opcional S0/S1/S2 usa una secuencia representativa del terreno; no es una agregación por superficie de cultivos simultáneos. El registro completo se conserva en las tarjetas y calendario por zona.

La verificación del dominio público de Vercel debe realizarse después de cada despliegue. La disponibilidad temporal de proveedores externos y el rendimiento en dispositivos físicos dependen del entorno de ejecución.
