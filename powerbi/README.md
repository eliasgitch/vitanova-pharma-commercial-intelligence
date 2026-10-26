# VitaNova | Power BI Implementation

The Power BI implementation combines a source-readable PBIP project, a dimensional semantic model in TMDL, centralized DAX measures and a purpose-built custom visual for commercial performance reporting.

[Open PBIP project](VitaNova.pbip) · [PBIX companion](VitaNova.pbix) · [Custom visual source](../powerbi-custom-visual/)

## Project components

| Component | Implementation |
|---|---|
| Report | One PBIR page hosting the integrated VitaNova dashboard visual |
| Semantic model | 9 tables: 5 dimensions, 3 commercial facts and a measures table |
| Relationships | 12 dimension-to-fact relationships |
| Measures | 66 DAX measures |
| Custom visual | 17 DataView roles: 9 categorical, 8 analytical |
| Data loading | Synthetic source tables embedded in Power Query M |

The dashboard itself contains six navigable analytical workspaces: Executive overview, Sales performance, Budget control, Product portfolio, Geographic markets, and Forecast & scenarios.

## Dimensional model

- FactSales — gross and net sales, units, discounts, returns and cost of goods sold.
- FactBudget — the approved commercial budget at comparable grain.
- FactForecast — actualized and forecast commercial periods.
- DimDate — conformed reporting calendar.
- DimProduct — product brands and therapeutic areas.
- DimMarket — countries and regional reporting attributes.
- DimChannel — commercial distribution channels.
- DimScenario — illustrative sensitivity parameters.
- _Measures — centralized DAX calculations.

The facts share month × brand × market × channel grain. Shared dimensions filter each fact through single-direction relationships, with no fact-to-fact join.

## Core reporting principles

| Analytical rule | Implementation |
|---|---|
| Comparable reporting periods | Actuals and approved budget use the same selected period |
| Budget attainment | Ratio of aggregated net sales to aggregated budget |
| Gross margin | Aggregated gross profit divided by aggregated net sales |
| Latest actual close | September 2026 |
| Full-year outlook | Closed actuals plus projected periods |
| Scenario sensitivity | Adjustments to future projections only |

## Open in Power BI Desktop

1. Open [VitaNova.pbip](VitaNova.pbip) with a compatible Power BI Desktop version on Windows.
2. Load the report and semantic model, then inspect the relationships and DAX measures.
3. Open the integrated VitaNova visual and explore its internal dashboard navigation.
4. Use [VitaNova.pbix](VitaNova.pbix) as the supplied binary companion.

All source data in the semantic model is fictional and embedded in Power Query, so opening the PBIP does not require a specific local CSV directory. The [powerbi/data](data/) directory provides human-readable synthetic dataset copies.

The custom visual source and build instructions are maintained in [powerbi-custom-visual](../powerbi-custom-visual/). Runtime and refresh compatibility should be checked in the Power BI Desktop environment used to open the project.

For the business context, screenshots and live browser demonstration, see the [main project README](../README.md).
