# VitaNova native layout | 27-inch display

The native Power BI pages use a **1600 × 820** source-readable PBIR canvas with
`FitToPage`. This is independent of the 27-inch diagonal / Windows display scaling.

Layout (source coordinates):

- 14–86: brand and page title only; no slogans.
- 103–171: conformed native slicers.
- 182–287: four native KPI cards.
- 301–527: primary chart row.
- 539–788: enlarged detail row (native tables and secondary visuals).
- 800–816: minimal synthetic-data footer.

Files named `VitaNova-*.json` document actual layout geometry.
The report source of truth is `../VitaNova.Report/definition/pages/`.
The canonical layout generator is `../../scripts/redesign_powerbi_layout.py`,
run automatically after `../../scripts/build_powerbi_pbip.py`.

**Color guidance:** categorical therapeutic areas and products are assigned
blue–teal colors. Favorable / unfavorable performance should use conditional
formatting against 100% attainment (green/red), never red for unrelated product
categories. This is applied semantically in the standalone web UI. The native
PBIP supplies a muted theme but conditional visual formatting remains a task
for validation in Power BI Desktop (not claim of a verified live implementation).
