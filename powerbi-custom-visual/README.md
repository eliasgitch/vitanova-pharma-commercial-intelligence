# VitaNova — visual personalizado para Power BI

Visual nativo `.pbiviz` de VitaNova: representa el HTML suministrado mediante CSS/SVG.
Los datos comerciales llegan exclusivamente del DataView de Power BI con 17 campos: nueve dimensiones y ocho medidas DAX.

## Entrega
El archivo `.pbiviz` compilado está en `dist/`. Su código fuente está en `src/`.
El PBIP incluye una página adicional con el visual incrustado y los 17 campos ya enlazados.
Los filtros internos de terapia, producto/marca, mercado, región y canal se publican al host mediante `applyJsonFilter`; los cortes de mes son locales porque el informe necesita datos acumulados YTD.

## Reconstruir
Desde esta carpeta, con Node.js 20+ y conexión a npm si necesitas dependencias:

```shell
npm ci
npx tsc --noEmit
npx pbiviz package
```

## Límites de validación
Las comprobaciones automáticas verifican el TypeScript, el paquete y el enlace PBIR. La representación y persistencia en PBIX requieren abrir el PBIP en Power BI Desktop (Windows); no se puede generar aquí un PBIX binario verificado.
