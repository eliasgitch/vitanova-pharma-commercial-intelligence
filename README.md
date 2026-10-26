<div align="left">
  <img src="assets/vitanova-logo-light.png" alt="VitaNova Pharmaceuticals — fictional pharmaceutical brand" width="255" />
</div>

# VitaNova Pharmaceuticals | Global Commercial Intelligence

An end-to-end pharmaceutical analytics case study: from synthetic commercial data and dimensional modeling to decision-ready reporting in Power BI and an interactive web experience.

[Explore the interactive dashboard](https://eliasgitch.github.io/vitanova-pharma-commercial-intelligence/) · [Power BI project](powerbi/VitaNova.pbip) · [Power BI report (.pbix)](powerbi/VitaNova.pbix) · [Power BI custom visual source](powerbi-custom-visual/)

> Demo project. VitaNova Pharmaceuticals and all product brands are fictional. Sales, budget, forecast and market data are synthetic. No real patient, prescription or company-confidential records are used.

---

## Executive overview

VitaNova is a global commercial intelligence workspace designed to answer the questions that matter to pharmaceutical business and finance teams: How are actual sales tracking against plan? Which brands and therapeutic areas explain performance? Where are geographic opportunities and shortfalls emerging? How does the full-year outlook compare with the approved budget?

The project combines comparable actual, budget and forecast facts in a shared analytical model, then translates them into a cohesive reporting experience. The emphasis is on clear KPI definitions, financial reconciliation, meaningful interaction and deliberate dashboard design — not charts in isolation.

[![VitaNova — Executive overview](assets/dashboard-overview.png)](assets/dashboard-overview.png)

*Executive overview — commercial KPIs, revenue trends, therapeutic mix, budget variances and geographic performance. Click to enlarge.*

## Explore the six analytical workspaces

| Sales performance | Budget control |
|:---:|:---:|
| [![Sales performance dashboard](assets/dashboard-sales.png)](assets/dashboard-sales.png) | [![Budget control dashboard](assets/dashboard-budget.png)](assets/dashboard-budget.png) |
| Revenue evolution, growth drivers and channel contribution | Budget attainment, variances and performance gaps |

| Product portfolio | Geographic markets |
|:---:|:---:|
| [![Product portfolio dashboard](assets/dashboard-portfolio.png)](assets/dashboard-portfolio.png) | [![Geographic markets dashboard](assets/dashboard-markets.png)](assets/dashboard-markets.png) |
| Brand mix, therapeutic performance and commercial profitability | Country rankings, Europe map and regional performance matrix |

[![Forecast and scenarios dashboard](assets/dashboard-forecast.png)](assets/dashboard-forecast.png)

*Forecast & scenarios — full-year outlook, baseline and alternative commercial assumptions.*

## Dataset at a glance

| Dimension | Coverage |
|---|---|
| Therapeutic areas | 6 |
| Product brands | 12 fictional brands |
| Geography | 8 country markets |
| Commercial channels | 3 |
| Reporting horizon | January 2025 – December 2026 |
| Latest closed actual period | September 2026 |
| Sales actuals | 6,048 monthly fact records |
| Approved budget | 6,912 monthly fact records |
| Forecast | 3,456 monthly fact records |
| Reporting currency | EUR |

The three financial facts use the same month × brand × market × channel grain. Shared dimensions provide a consistent basis for comparisons across actual performance, approved plan and outlook.

## Analytical capabilities

01 / Executive overview — Follow net sales, profitability, commercial momentum and budget attainment. Explore therapeutic trends, revenue mix, a reconciled budget-variance waterfall and regional performance.

02 / Sales performance — Analyze monthly revenue, year-over-year growth, brand contribution and distribution-channel mix.

03 / Budget control — Compare actuals against plan with MTD, QTD and YTD measures, absolute and relative variances, and dimensional breakdowns.

04 / Product portfolio — Assess brand rankings, therapeutic concentration, sales contribution, units and gross margins.

05 / Geographic markets — Evaluate performance by country and region through a geographic view, market rankings and a region-by-therapy performance matrix.

06 / Forecast & scenarios — Compare the full-year outlook with the approved budget, and examine baseline, upside and downside sensitivities while preserving actualized periods.

The browser dashboard supports interactive cross-filtering, contextual selections, filter resets, detailed rankings and CSV export.

## Technical architecture

~~~text
           Synthetic commercial source data
                Sales | Budget | Forecast
                          |
                          v
              Conformed dimensional model
              Facts, dimensions and grain
                          |
               +----------+----------+
               |                     |
               v                     v
       Power BI semantic model   Interactive web dashboard
         PBIP / TMDL / DAX         HTML / CSS / JavaScript
         Power Query (M)            SVG visualizations
               |                     |
               v                     v
       Power BI custom visual    Self-contained browser demo
        17 semantic data roles   Bundled synthetic dataset
               |                     |
               +----------+----------+
                          |
                          v
              Decision-ready commercial KPIs
~~~

### Semantic model and Power BI

The [editable Power BI project](powerbi/VitaNova.pbip) contains 9 tables, 12 relationships and 66 DAX measures. Its integrated report page hosts a purpose-built custom visual, which exposes six internal dashboard workspaces.

- FactSales — commercial actuals: gross and net sales, discounts, returns, units and cost of goods sold.
- FactBudget — approved commercial plan at a comparable reporting grain.
- FactForecast — closed actualized periods and projected outlook periods.
- DimDate, DimProduct, DimMarket and DimChannel — conformed analysis dimensions.
- DimScenario — independent illustrative scenario parameters.
- _Measures — centrally governed DAX calculations, including time intelligence and commercial-finance KPIs.

Relationships use single-direction dimension-to-fact filtering. The three fact tables are not joined directly to each other.

The [Power BI custom visual](powerbi-custom-visual/) consumes the semantic model through 17 DataView roles: nine categorical attributes and eight analytical values. Its financial figures are supplied by Power BI measures, not hardcoded business values inside the visual.

The standalone browser demo uses its own bundled synthetic data. It is a separate runtime, not a live connection to Power BI Service.

### Metric methodology

| Metric | Analytical definition |
|---|---|
| Net sales | Gross sales less discounts and returns |
| Gross profit | Net sales minus cost of goods sold |
| Gross margin | Gross profit / net sales |
| Budget attainment | Actual net sales / comparable approved budget |
| Budget variance | Actual net sales minus comparable approved budget |
| YTD actual versus budget | Actuals and plan for the same closed-year period |
| Full-year outlook | Closed actuals combined with projected periods |
| Scenario sensitivity | Changes to the projected portion, without rewriting actuals or the approved plan |

Percentages are calculated as ratios of aggregated measures rather than averages of row-level percentages. YTD performance and full-year outlook are reported against matching time horizons.

## Technology stack

| Layer | Technologies and concepts |
|---|---|
| Analytics and semantic layer | Power BI Desktop, DAX, Power Query (M), PBIP, PBIR, TMDL |
| Dimensional modeling | Conformed dimensions, comparable fact grain, star-schema design |
| Custom visualization | Power BI Visuals SDK, TypeScript, DataView mapping, SVG |
| Dashboard engineering | HTML, CSS, JavaScript, responsive layouts, cross-filtering |
| Distribution | PBIP / PBIX, offline HTML demo, GitHub Pages, Git / GitHub |

## Run locally

### Browser experience

1. Clone or download this repository.
2. Open [index.html](index.html) in Chrome or Edge.
3. Explore the six workspaces, filters, budget comparisons and scenario analysis. No API keys or backend are required.

The [live dashboard link](https://eliasgitch.github.io/vitanova-pharma-commercial-intelligence/) becomes available when GitHub Pages is enabled for the repository's main branch.

### Power BI experience

1. Open [powerbi/VitaNova.pbip](powerbi/VitaNova.pbip) in a compatible Power BI Desktop version on Windows.
2. Inspect the semantic model, 66 DAX measures and integrated custom visual.
3. The repository also includes a [PBIX companion](powerbi/VitaNova.pbix). The PBIP/TMDL structure is the editable, source-readable reference.
4. The [custom visual source](powerbi-custom-visual/) is available for code review and SDK-based compilation.

The compiled custom visual is not provided as a separate downloadable PBIVIZ in this repository. Compatibility and refresh behavior should be verified in the target Power BI Desktop environment.

## Engineering notes and scope

- All commercial records and assumptions are fictional and exist solely for analytics demonstration.
- The geographic view focuses on European countries; other markets can still be represented in rankings and aggregate KPIs.
- Scenario parameters illustrate commercial sensitivity, not an independently calibrated demand forecast.
- Source tables are embedded in Power Query M, so the semantic model does not rely on a developer-specific local CSV path.
- This is an analytics engineering portfolio project, not a real pharmaceutical operating system or a clinical decision tool.

---

### Author

Elías Chafih Meddah · Senior BI & Analytics Engineer  
[GitHub](https://github.com/eliasgitch) · [Project repository](https://github.com/eliasgitch/vitanova-pharma-commercial-intelligence)

<sub>VitaNova is a fictional pharmaceutical brand created for this independent portfolio project. All displayed figures and commercial entities are illustrative.</sub>
