# VitaNova | Power BI Custom Visual

A purpose-built Power BI visual that presents VitaNova's six-workspace commercial analytics interface using measures and dimensions from the Power BI semantic model.

[Main project overview](../README.md) · [Power BI PBIP](../powerbi/VitaNova.pbip)

## Design and integration

The visual is implemented with the Power BI Visuals SDK, TypeScript, CSS and SVG. It receives commercial data through Power BI DataView mappings rather than embedding hardcoded sales, budget or forecast figures in the visual bundle.

Its 17 data roles cover:

- 9 categorical fields: year-month, product identifier, brand, therapeutic area, market identifier, country, region, channel identifier and channel.
- 8 analytical fields: net sales, cost of goods sold, units, budget sales, budget cost, budget units, forecast sales and forecast cost.

The interface contains Executive overview, Sales performance, Budget control, Product portfolio, Geographic markets, and Forecast & scenarios. Selections can interact with the semantic model through Power BI filtering capabilities.

## Source layout

| Path | Purpose |
|---|---|
| src/ | Visual implementation, data mapping, rendering and styling helpers |
| style/ | Visual stylesheet |
| assets/ | Visual icon |
| capabilities.json | Data roles and Power BI integration contract |
| pbiviz.json | Visual identity and SDK configuration |
| package.json | Build dependencies and scripts |

## Build locally

Install Node.js and run the following commands in this directory:

~~~powershell
npm ci
npx tsc --noEmit
npx pbiviz package
~~~

The SDK produces the PBIVIZ package in the build output directory when packaging succeeds. The compiled PBIVIZ is not separately tracked in this repository; the source and embedded PBIR visual registration are provided for inspection.

To inspect the delivered report, open [powerbi/VitaNova.pbip](../powerbi/VitaNova.pbip) in a compatible Power BI Desktop version. Actual rendering and refresh behavior should be verified there.

All figures originate from a fictional pharmaceutical dataset and are for portfolio demonstration only.
