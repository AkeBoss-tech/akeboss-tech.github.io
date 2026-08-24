# Modo: scan — Monitor determinista de ofertas

Descubre ofertas con conectores repetibles, conserva evidencia de origen y
añade solo los roles relevantes al pipeline. La ruta normal no requiere IA.

## Ruta principal

```bash
npm run scan:preview      # fetch en vivo, sin escrituras
npm run scan              # snapshot canónico + pipeline legacy
npm run monitor:preview   # fuentes que están pendientes
npm run monitor           # procesa solo las fuentes pendientes
npm run monitor:status    # salud, leases y escalaciones
```

`scan-jobs.mjs` lee `config/sources.yml` y aplica los filtros/overrides locales
de `portals.yml`. Los conectores registrados cubren Greenhouse, Ashby, Lever,
SmartRecruiters, Workable, Teamtailor RSS, Pinpoint, Personio, Recruitee,
la API oficial de empleos de Hacker News, JobPosting JSON-LD y Workday CXS.

## Datos producidos

- `data/jobs.ndjson`: registros canónicos, incluida la historia open/closed.
- `data/relevant-jobs.ndjson`: roles abiertos que pasan el filtro personal.
- `data/scan-summary.json`: resultado, completitud y calidad por fuente.
- `data/raw/`: respuestas HTTP comprimidas y direccionadas por SHA-256.
- `data/monitor.sqlite`: registro, leases, ejecuciones, salud y backoff.
- `data/agent-escalations.ndjson`: problemas acotados para investigar.
- `data/pipeline.md` y `data/scan-history.tsv`: proyecciones compatibles.

Estos archivos son personales, cambian continuamente y no se versionan.

## Reglas de autoridad

1. La identidad canónica es `connector + board + source_job_id`; no deduplicar
   por título porque dos ubicaciones o requisiciones pueden ser diferentes.
2. Un traversal completo y plausible es autoritativo. Un resultado parcial o
   sospechoso puede añadir/actualizar ofertas observadas, pero nunca cerrar las
   que faltan.
3. La primera omisión autoritativa marca `possibly_closed`. Solo una segunda
   omisión, al menos seis horas después, marca `closed`.
4. En una fuente de ventana móvil como Hacker News, salir de la ventana marca
   el registro `unknown`, nunca `closed`; una ventana truncada se pone en
   cuarentena por la misma protección de caídas anómalas.
5. Errores, timeouts, paginación parcial y caídas anómalas conservan el estado
   anterior. Una caída grande revisada se acepta explícitamente para una sola
   empresa:

   ```bash
   node scan-jobs.mjs --company Acme --accept-drop Acme --strict
   ```

6. Las descripciones se guardan en NDJSON/snapshots, nunca en TSV o Markdown
   posicional, porque tabs, saltos y pipes romperían los lectores legacy.

## Monitor programático

`monitor-jobs.mjs` sincroniza el catálogo con SQLite, reclama las fuentes
pendientes con leases y ejecuta un único scanner con flags `--company`
repetibles. Por defecto, los feeds normales se actualizan cada seis horas y
Workday cada doce; errores usan backoff exponencial y anomalías se reintentan
antes.

En macOS se puede inspeccionar o instalar un LaunchAgent que despierta el
monitor cada 15 minutos. El propio registro decide si algo está pendiente:

```bash
npm run monitor:plist
npm run monitor:install
npm run monitor:install -- --write-pipeline
node scripts/install-monitor-launchd.mjs --uninstall
```

La instalación es explícita. Sin `--write-pipeline`, el monitor actualiza los
datos canónicos pero no llena automáticamente el backlog legacy.

## Lane de agentes para casos complejos

Los agentes no forman parte del refresh normal. Solo consumen una escalación
estructurada después de fallos repetidos, drift de schema, una URL migrada o
una empresa sin conector.

Contrato del agente:

- Puede devolver configuración de conector, evidencia del endpoint, diagnóstico
  o una receta de extracción determinista.
- No puede escribir `jobs.ndjson`, cerrar ofertas ni decidir que una ejecución
  parcial es completa.
- La propuesta se prueba contra fixtures y una consulta en vivo; solo entonces
  se añade al catálogo y vuelve al monitor normal.

Para sitios sin API/feed público: respetar `robots.txt` y términos, usar la URL
canónica de la empresa, limitar concurrencia, no iniciar sesión, no eludir
CAPTCHAs y no adivinar slugs masivamente. Playwright/WebSearch sirven para
descubrir o reparar el conector, no como dependencia recurrente si se puede
reproducir una extracción determinista.

## Añadir una fuente

Preferir, en orden:

1. Feed/API público documentado.
2. Endpoint del career site público con paginación verificable.
3. Sitemap/RSS + `JobPosting` JSON-LD.
4. HTML determinista con fixture y alerta de drift.
5. Agente para descubrir los identificadores y proponer una de las opciones
   anteriores.

Guardar la empresa en `config/sources.yml` si es reusable o en `portals.yml` si
es personal. Requerir `name`, `ats`, identificador estable (`ats_slug` o campos
equivalentes), `careers_url`, listas de interés y `enabled`. Validar que no haya
nombres ni identidades de fuente duplicadas y ejecutar primero:

```bash
node scan-jobs.mjs --company "Nombre de empresa" --dry-run --strict
```

Un HTTP 200 no basta: comprobar el conteo anunciado, todas las páginas, IDs y
URLs estables, y al menos una segunda ejecución idempotente.
