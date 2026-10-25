# VitaNova Pharmaceuticals | Power BI Project (PBIP / TMDL / PBIR)

## Corrección de apertura (21/10/2026) — Microsoft.MashupEngine: Depth limit exceeded

La primera prueba real en Desktop de la entrega V5.0 mostró `Microsoft.MashupEngine; Depth limit exceeded` al cargar el modelo. La causa probable son las más de 1.000 concatenaciones anidadas de literales Base64 en las particiones de hechos. **V5.1 elimina la cadena de operadores `&`** y la sustituye por `Text.Combine({ ... })`, una lista plana de segmentos largos; ahora la tabla más grande utiliza 71 elementos en vez de más de mil concatenaciones anidadas. El script `scripts/validate_m_depth.py` recupera los ocho CSV del M y comprueba los bytes uno por uno.

**Pendiente:** apertura y actualización reales en tu Power BI Desktop. Las verificaciones estáticas no pueden garantizar la compatibilidad con la versión concreta de Desktop. No hay PBIX verificado hasta que el PBIP abra y guardes **Archivo → Guardar como → `.pbix`**.

## Réplica web 1:1 como visual personalizado (código fuente)

`custom-visual/VitaNovaWebReplica/` contiene una implementación de la web V5.0 preparada para el SDK de objetos visuales personalizados de Microsoft: reutiliza el markup, los SVG, el CSS, la cartografía, la lógica interactiva y el conjunto de datos sintéticos. Se genera con `python scripts/build_custom_visual_sources.py`. Para compilar un `.pbiviz` en Windows, en esa carpeta ejecutar `npm install` y `npx pbiviz package`.

**Diferencia esencial:** la réplica no tiene aún vinculación `DataView` con el modelo semántico de Power BI ni envía selecciones a los visuales nativos; sus filtros internos sí funcionan. El `.pbiviz` compilado y probado en Desktop constituye el siguiente hito. No se suministra ningún archivo `.pbiviz` compilado en V5.1.


## Corrección visual V4.3

Los **3 gráficos de líneas nativos** usan `lineStyles.lineChartType = smooth` y `interpolationSmooth = monotoneX` (se muestran también los puntos). Los **2 mapas rellenos de Europa** aplican un filtro exclusivamente sobre el visual que excluye Estados Unidos del encuadre, sin alterar métricas globales ni rankings. `DimMarket[Country]` tiene categoría semántica geográfica `Country`. Al reconstruir el PBIP se vuelven a aplicar todos estos ajustes mediante `scripts/apply_map_and_smooth_visuals.py`; no elimines este último paso. La renderización en Desktop sigue pendiente de comprobar.

## New corporate logo

All six PBIR report pages include the approved VitaNova V-shaped navy/teal logo, embedded in the PBIP at `VitaNova.Report/StaticResources/RegisteredResources/vitanova-brand-20261021.png`. Its data source is the same synthetic model as before. La réplica web como visual personalizado está disponible en forma de fuente compilable; no sustituye a los visuales nativos.

## Open the project

**Start at [`VitaNova.pbip`](VitaNova.pbip)** in Power BI Desktop (Windows, compatible PBIP/PBIR version). The project contains a Power BI native report with six pages, a source-readable semantic model in TMDL, 64 central DAX measures, and 12 single-direction dimension-to-fact relationships. All eight CSV source marts are embedded as compressed import queries, so **the project does not require an absolute local folder path, OneDrive, GitHub access or a connection string** to refresh its demonstration data.

> **Verification status:** the PBIP is structurally generated and statically validated, including source-file round trips, field bindings, page dimensions, report page links and in-canvas visual placement. We do **not** have Microsoft Power BI Desktop available in this environment, so this is **not a Power BI Desktop runtime/refresh validation** or a compiled `.pbix` deliverable. If Desktop flags a compatibility issue, review the relevant generated TMDL/PBIR JSON and rebuild with the script below.

## What you get

| Asset | Count | Notes |
|---|---:|---|
| PBIP project | 1 | `VitaNova.pbip` |
| Semantic model TMDL | 9 tables | 5 dimensions, 3 finance facts, `_Measures` |
| Relationships | 12 | DimDate, DimProduct, DimMarket, DimChannel → 3 financial facts |
| Measures | 64 | Base, MTD/QTD/YTD, PY, full-year scenario, and default as-of reporting |
| Native PBIR report pages | 6 | Overview, Sales, Budget, Product, Geography, Forecast |
| Native visuals | 91 | 4 KPI cards, slicers, charts, tables, titles and footnote on each page |
| Data source dependencies | 0 | 8 source tables included as portable compressed CSV in Power Query M |

## Desktop setup for a 27-inch screen

The six pages are **Custom 1600 × 820** with `displayOption: FitToPage`. The V3 PBIR uses one brand label (VITANOVA / COMMERCIAL INTELLIGENCE) and a single business-page title. The report uses a concise header, a single slicer band, four KPI cards, two primary chart panels and an enlarged detail row (249 px instead of 185 px). In Desktop use **View → Page view → Fit to page**, not **Actual size** or **Fit to width**. This uses the remaining visible Power BI working area after the Windows taskbar, Desktop ribbon, page tabs and any open side panes. The physical 27-inch diagonal does not determine the resolution; it works with both Full HD and QHD displays.

You can use the separate responsive website by opening `../index.html`. **The Power BI report uses native Power BI visuals and does not share the web application's HTML interface.** The two presentations use the same synthetic CSV input facts and common business metric definitions.

## Model conventions and commercial finance rules

- `FactSales`, `FactBudget` and `FactForecast` maintain the same **month × brand × market × channel** grain, and do not join directly to each other.
- Actuals close in **September 2026**. All YTD/QTD/MTD *Reporting* measures use that fixed maximum close when no earlier reporting period is selected. The year can be selected using a slicer.
- Denominators use the matched reporting period. Attainment is SUM(actual) / SUM(budget), **not** the average of per-record percentages.
- The **2026 full-year budget** is compared only with the **2026 full-year outlook**, never with Jan–Sep YTD actuals.
- Scenario sensitivities change **October–December projected sales and COGS only**. Actualized forecast rows, approved budget and actuals remain unchanged.
- `DimScenario` is intentionally disconnected. All financial amounts are euros; packs sold do not represent patient counts.

## Build and validate

From the repository root, with Python 3.10+ and no third-party Python packages:

```powershell
python scripts/generate_data.py
python scripts/build_powerbi_pbip.py
python scripts/validate_visual_corrections.py
python scripts/validate_powerbi_pbip.py
python scripts/validate_data.py
```

The build script regenerates the native PBIP from the deterministic CSVs. The reproducible build automatically calls `scripts/redesign_powerbi_layout.py` after writing the native report, so it does not revert to the prior crowded geometry. The separate `DAX/Measures.dax` and `PowerQuery/LoadCsvExample.pq` files remain reference material if you prefer creating a fresh model manually. The `layout/` folder documents canvas geometry and provides a safe canvas resizing utility. It is supplementary: the actual native pages now reside under `VitaNova.Report/definition/pages/`.

### Open in Power BI Desktop

1. Extract the entire project ZIP, preserving folder structure.
2. Double-click `powerbi/VitaNova.pbip` (or open it via Power BI Desktop).
3. If prompted, enable/load the report and semantic model in a compatible Desktop release.
4. Refresh and verify the expected benchmark: **YTD September 2026 = €355,801,522.16 actual**, **€377,685,988.11 budget**. Full-year scenario baseline forecast: **€478,868,717.75**.
5. Select *Fit to page* and save changes. For a distributable `.pbix`, use Power BI Desktop to save a copy in that format.

**No compiled `.pbiviz` is supplied.** The six native report pages do not need it; the separate replica SDK does.
