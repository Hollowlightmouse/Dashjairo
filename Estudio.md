# Estudio del sistema

## Flujo de datos (de inicio a pantalla)
1. El usuario abre el frontend (`dashboard-ui`).
2. `src/App.jsx` carga filtros y resumen llamando a `src/api/bigquery.js`.
3. `src/api/bigquery.js` crea un cliente Axios con `VITE_API_BASE_URL` y consulta los endpoints REST.
4. El backend (`dashboard-api`) expone `/api/datos`, `/api/resumen` y `/api/filtros`.
5. `dashboard-api/main.py` construye consultas SQL contra BigQuery y devuelve JSON.
6. `dashboard-api/conexion_bq.py` inicializa el cliente de BigQuery usando credenciales de `.env`.
7. El frontend recibe la respuesta y renderiza KPI, graficas y tabla.

## Funcionamiento general
- Frontend: React + Vite consume la API y presenta graficas con Chart.js.
- Backend: FastAPI consulta BigQuery y expone datos agregados y detallados.
- Credenciales: se cargan desde `.env` con `GOOGLE_CREDENTIALS_JSON`.
- Enrutamiento API:
  - Desarrollo: `VITE_API_BASE_URL=http://localhost:8000/api`.
  - Produccion (Vercel): las rutas `/api/*` se reenvian a `api/index.py`.

## Archivos y carpetas (descripcion)

### Raiz
- `.env`: credenciales para BigQuery en `GOOGLE_CREDENTIALS_JSON` (ignorado por git).
- `.gitignore`: excluye `.env`, credenciales y archivos generados.
- `README.md`: instrucciones de instalacion, ejecucion y endpoints.
- `vercel.json`: rutas y builds para desplegar frontend y backend en Vercel.

### api/
- `api/index.py`: entrypoint de Vercel; agrega `dashboard-api` al `sys.path` y expone `app` de FastAPI.

### dashboard-api/
- `dashboard-api/main.py`: API FastAPI con endpoints `/api/datos`, `/api/resumen`, `/api/filtros`.
  - Usa consultas SQL a la tabla `mapaibague.PRESENTACION.PRESENTACION`.
  - Ejecuta varias consultas en paralelo para el resumen.
- `dashboard-api/conexion_bq.py`: crea el cliente de BigQuery.
  - Lee `.env` con `python-dotenv`.
  - Si existe `GOOGLE_CREDENTIALS_JSON`, crea credenciales en memoria.
  - Si no, usa ADC (`bigquery.Client()` sin credenciales explicitas).
- `dashboard-api/requirements.txt`: dependencias del backend.

### dashboard-ui/
- `dashboard-ui/package.json`: dependencias y scripts del frontend.
- `dashboard-ui/vite.config.js`: configuracion de Vite (incluye proxy en dev).
- `dashboard-ui/.env`: define `VITE_API_BASE_URL` para la API.
- `dashboard-ui/src/main.jsx`: punto de entrada React.
- `dashboard-ui/src/App.jsx`: flujo principal de datos, filtros y renderizado.
- `dashboard-ui/src/api/bigquery.js`: cliente Axios y funciones `getDatos`, `getResumen`, `getFiltros`.
- `dashboard-ui/src/constants.js`: paleta de colores y util para truncar texto.
- `dashboard-ui/src/components/BarChartTipos.jsx`: grafica barras por tipo.
- `dashboard-ui/src/components/PieChartTenencia.jsx`: dona por tenencia.
- `dashboard-ui/src/components/TopCapacidades.jsx`: barras horizontales por capacidad.
- `dashboard-ui/src/components/BarChartCaja.jsx`: barras por caja de compensacion.
- `dashboard-ui/src/components/BarChartCapacidad.jsx`: barras por capacidad (componente alterno).
- `dashboard-ui/src/components/KPIcards.jsx`: tarjetas KPI del resumen.
- `dashboard-ui/src/components/DataTable.jsx`: tabla de datos detallados.

## Conexion y rutas clave
- Backend local: `http://localhost:8000`
- Frontend local: `http://localhost:5173`
- API base: `VITE_API_BASE_URL` en `dashboard-ui/.env`
- Endpoints:
  - `GET /api/datos`
  - `GET /api/resumen`
  - `GET /api/filtros`
