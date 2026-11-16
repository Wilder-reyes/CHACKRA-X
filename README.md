# CHACKRA X

Plataforma de planificación agrícola por zonas para **NASA Space Apps Challenge 2026 · Field Shift**. Ayuda a delimitar un terreno, registrar sus cultivos y evaluar próximas siembras mediante referencias agronómicas e información científica de la NASA.

## Funcionalidades

- Mapa interactivo para buscar localidades y dibujar, importar o editar el terreno.
- Polígonos de cultivo con centro y vértices editables, validación de límites y prevención de superposiciones.
- Registro del cultivo actual y mes de siembra por zona. Se admiten cultivos y fechas iguales en distintas zonas; el terreno sin sembrar no se contabiliza como zona agrícola.
- Nueve cultivos disponibles para el registro: maíz amarillo duro, camote, papa, frijol canario, frijol castilla, vainita, pallar, cebolla y zanahoria.
- Recomendaciones por zona, calendario de referencia, instrucciones de preparación y fuentes.
- PDF descargable con mapa vectorial y opción de compartir archivos en dispositivos compatibles; alternativa manual para WhatsApp.
- Recorrido opcional con **CHOKLITO**, diseño responsive, modo oscuro y claro, español e inglés (`?lang=en`).

## Arquitectura

**Frontend:** React, TypeScript, Vite y Leaflet. **API científica:** Python y FastAPI, alojada en un servicio independiente. El frontend de producción utiliza `/api/*` mediante el proxy HTTPS definido en `frontend/vercel.json`.

```text
frontend/       Interfaz, mapas, planificación, PDF y pruebas de navegador
backend/        API, conectores científicos, catálogos y modelo HLS
scripts/        Verificación de datos y reproducción del modelo
tests/          Pruebas científicas y de contratos
docs/           Fuentes y validación
```

## Instalación local

Requisitos: Node.js 24+, npm y Python 3.12+.

Desde la raíz, inicia la API:

```sh
python -m venv .venv
. .venv/bin/activate
pip install -r backend/requirements.txt
python -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000
```

En otra terminal:

```sh
cd frontend
npm ci
npm run dev
```

La interfaz local usa `http://localhost:8000` para la API. Las variables privadas se documentan en `backend/.env.example`. No incluyas credenciales en Git ni en el código del navegador.

## Compilación y pruebas

```sh
cd frontend
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Desde la raíz:

```sh
PYTHONPATH=backend python -m unittest discover -s tests -p 'test_*.py'
python scripts/reproduce_field_shift_ai.py --check
```

Las pruebas de navegador incluyen consultas reales a la API y requieren conectividad. Los casos de prueba no representan recomendaciones para un agricultor real. Consulta [validación](docs/VALIDATION.md).

## Despliegue en Vercel

Importa `Wilder-reyes/CHACKRA-X` y configura:

| Campo | Valor |
| --- | --- |
| Project Name | `chakrax` |
| Root Directory | `frontend` |
| Framework | Vite |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Production Branch | `main` |

Deja `VITE_API_URL` sin definir para usar el proxy de `frontend/vercel.json`. La API se ejecuta de forma independiente; no requiere importar el backend como otro servicio de Vercel. El proxy se evalúa antes del fallback SPA.

Para conectar directamente otra API, `VITE_API_URL` debe ser su origen HTTPS, sin `/api`, credenciales, consulta ni fragmento. Ese servidor debe permitir el dominio del frontend mediante CORS. Este valor es público; las claves de Earthdata y almacenamiento pertenecen exclusivamente al backend.

Después de desplegar, verifica `/api/health`, `/fuentes`, `/como-funciona`, los tres pasos y la descarga del PDF en el dominio publicado.

## Fuentes y alcance científico

NASA POWER proporciona contexto climatológico regional cuando está disponible. Las referencias FAO-56 y agronómicas regionales sustentan las comparaciones calculadas. Las observaciones NASA HLS y el modelo estacional de prueba de concepto se aplican exclusivamente al polígono de estudio de Barranca.

NDVI no identifica especies de cultivo. Las recomendaciones fuera del ámbito de estudio son referencias generales que requieren verificación local. No se afirman predicciones de rendimiento, ganancias, ahorro real de riego ni validación física en campo. Las áreas de las zonas son aproximadas; un mes sin programación confirmada no implica descanso planificado.

Consulta [fuentes NASA y metodología](docs/NASA.md). El modelo se reproduce a partir de los datos científicos versionados, sin modificar sus coeficientes ni rellenar observaciones ausentes.

## Licencia

Consulta [LICENSE](LICENSE). Los datos y recursos de terceros mantienen sus propias licencias y atribuciones.
