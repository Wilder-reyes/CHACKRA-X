# CHACKRA X

**Tu tierra. Tu decisión.**

CHACKRA X es una plataforma web de apoyo a la planificación agrícola por zonas. Permite identificar un terreno en el mapa, registrar qué está sembrado actualmente en cada área y consultar un plan orientativo de próximas siembras, con información agronómica y fuentes científicas de la NASA.

**Aplicación:** https://chakrax.vercel.app/  
**Proyecto:** NASA Space Apps Challenge 2026 · Field Shift

> CHACKRA X apoya decisiones agrícolas; sus propuestas son orientativas y deben contrastarse con las condiciones de suelo, clima, disponibilidad real de agua y asesoría agronómica local.

## Qué puedes hacer

| Función | Descripción |
| --- | --- |
| **Recorrido con CHOKLITO** | Bienvenida y guía interactiva opcional para completar los tres pasos. |
| **Mapa de tu terreno** | Buscar una localidad, explorar un ejemplo, dibujar o importar el contorno y consultar su superficie aproximada. |
| **Zonas sembradas** | Delimitar polígonos, moverlos y ajustar sus vértices; comprobar que no salgan del terreno ni se superpongan. |
| **Registro de cultivos actuales** | Indicar qué cultivo está sembrado y cuándo se sembró en cada polígono. Se permiten coincidencias de cultivo y fecha entre zonas. |
| **Plan por zonas** | Consultar cultivos sugeridos, razones, fechas orientativas e instrucciones de preparación. |
| **Mapa y calendario de rotación** | Explorar las propuestas por zona y mes. Los meses sin programación confirmada se distinguen de una campaña o un descanso planificado. |
| **Informe PDF A4** | Generar un PDF con los resultados de la sesión, croquis vectorial, zonas, recomendaciones, calendario y limitaciones. |
| **Compartir** | Compartir el PDF generado desde dispositivos compatibles; si no se admite compartir archivos, descargarlo y abrir WhatsApp para adjuntarlo manualmente. |
| **Accesibilidad y presentación** | Interfaz responsive para móvil, tablet y escritorio, temas claro/oscuro y español/inglés. |

### Cultivos disponibles para el registro

Maíz amarillo duro, camote, papa, frijol canario, frijol castilla (caupí), vainita, pallar, cebolla y zanahoria.

## Cómo utilizar CHACKRA X

1. **Inicia el recorrido.** Al abrir la web por primera vez, CHOKLITO presenta la aplicación. Puedes seguir la guía o explorar libremente.
2. **Paso 1 · Mi terreno.** Busca tu localidad, marca el perímetro de tu terreno en el mapa o utiliza el ejemplo disponible.
3. **Paso 2 · Mis cultivos.** Ajusta los polígonos de las áreas realmente sembradas. Selecciona una zona, indica su cultivo actual y la fecha en que lo sembraste. Repite hasta registrar todas las zonas.
4. **Paso 3 · Mi plan.** Elige el horizonte de planificación y genera una propuesta. Revisa el mapa, el calendario y los motivos de cada sugerencia.
5. **Guarda y comparte.** Descarga el PDF A4 de tu plan. Para enviarlo, utiliza el botón de compartir en un dispositivo compatible o adjunta el archivo descargado desde WhatsApp.

**Importante:** la superficie que queda fuera de los polígonos de siembra no se registra automáticamente como zona cultivada. Cada polígono puede tener un cultivo distinto o compartir cultivo y fecha con otras zonas.

Consulta la [guía de uso paso a paso](docs/USO.md).

## Cómo interpretar el plan

Cada zona muestra:

- **Zona y superficie:** identificación del área sembrada y hectáreas aproximadas.
- **Cultivo actual:** el producto y la fecha de siembra que registraste.
- **Próximo cultivo sugerido:** una alternativa que puedes evaluar para esa zona.
- **Cuándo sembrar:** mes de referencia, no una fecha garantizada.
- **Por qué:** explicación de la propuesta, con consideraciones como rotación de familias agrícolas.
- **Cómo prepararlo:** pasos prácticos y comprobaciones antes de sembrar.

**Un mes sin campaña programada no significa automáticamente que debas dejar descansar la tierra.** El calendario distingue las siembras propuestas, los cultivos en curso y los periodos sin programación confirmada.

## Información científica y alcance

CHACKRA X integra servicios de planificación agrícola con referencias de **NASA POWER**, observaciones de **NASA HLS** y criterios agronómicos como **FAO-56**, cuando corresponden a la consulta. La información satelital regional no equivale a una medición directa del interior de cada parcela.

El modelo histórico HLS documentado corresponde a una **parcela de estudio en Barranca**. Su señal describe periodos de vegetación baja; **no identifica especies cultivadas ni predice producción, cosechas o ingresos**, y no debe generalizarse a otros terrenos sin validación. Las propuestas para otras ubicaciones son referencias exploratorias sujetas a verificación local.

Ver [fuentes NASA y metodología](docs/NASA.md) y [alcance de la validación](docs/VALIDATION.md).

## Tecnologías

- **Interfaz:** React, TypeScript, Vite y Leaflet.
- **Mapas y polígonos:** cartografía interactiva y geometría editable.
- **Documentos:** PDF A4 generado en el navegador.
- **API:** Python y FastAPI.
- **Datos y modelos:** conectores científicos, catálogos agronómicos y modelo HLS reproducible.

```text
frontend/     Aplicación web, mapas, planes, PDF y pruebas de interfaz
backend/      API científica, conectores, modelos y datos
docs/         Guía de uso, fuentes y validación
scripts/      Comprobaciones y reproducción científica
tests/        Pruebas de la API y métodos científicos
```

## Ejecución local

Requisitos: Node.js 24+, npm y Python 3.12+.

**API (desde la raíz del repositorio):**

```sh
python -m venv .venv
# Linux/macOS:
. .venv/bin/activate
# Windows PowerShell:
# .venv\Scripts\Activate.ps1
python -m pip install -r backend/requirements.txt
python -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000
```

**Frontend (en otra terminal):**

```sh
cd frontend
npm ci
npm run dev
```

En desarrollo, la interfaz utiliza `http://localhost:8000` como API predeterminada. La configuración de variables se describe en `frontend/.env.example` y `backend/.env.example`.

### Comprobaciones disponibles

```sh
cd frontend
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Para las pruebas científicas, desde la raíz:

```sh
PYTHONPATH=backend python -m unittest discover -s tests -p 'test_*.py'
python scripts/reproduce_field_shift_ai.py --check
```

Las pruebas de navegador que consultan la API requieren que los servicios externos estén disponibles. Las verificaciones documentadas se detallan en [VALIDATION.md](docs/VALIDATION.md).

## Publicación

La web pública se encuentra en **https://chakrax.vercel.app/**. Para desplegar el frontend desde este repositorio en Vercel:

| Configuración | Valor |
| --- | --- |
| Proyecto | `chakrax` |
| Rama de producción | `main` |
| Directorio raíz | `frontend` |
| Framework | `Vite` |
| Instalación | `npm ci` |
| Compilación | `npm run build` |
| Salida | `dist` |

La aplicación consulta `/api/*` mediante el proxy HTTPS configurado en `frontend/vercel.json`. Cuando `VITE_API_URL` se deja sin definir, se utiliza esa ruta del mismo origen. Una API externa alternativa necesita un origen HTTPS válido y CORS compatible.

## Licencia

Consulta [LICENSE](LICENSE). Los recursos cartográficos, científicos y demás materiales de terceros conservan sus propias condiciones y atribuciones.
