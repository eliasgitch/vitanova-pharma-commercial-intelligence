import powerbi from "powerbi-visuals-api";
import IVisual = powerbi.extensibility.visual.IVisual;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import { layout } from "./layout";
import { geometry } from "./geometry";
import { embeddedCss } from "./styling";
import { mountVitaNova } from "./appRuntime";
import { readModelData, expectedBindings } from "./modelData";
import { renderMarkup } from "./domRendering";

/** Presentation layer only. Every business metric is supplied by the DataView,
 *  which is computed from the bound semantic-model measures.
 */
export class Visual implements IVisual {
    private readonly element: HTMLElement;
    private readonly stage: HTMLDivElement;
    private readonly canvasWidth = 1600;
    private readonly canvasHeight = 900;
    private readonly host: powerbi.extensibility.visual.IVisualHost;
    private hasNativeFilter = false;
    private savedState: Record<string, any> = {};
    private activeDataSignature = "";
    private cleanup: (() => void) | undefined;

    constructor(options: VisualConstructorOptions) {
        this.host = options.host;
        this.element = options.element;
        this.element.classList.add("vitanova-visual-host");
        this.element.textContent = "";
        const stylesheet = document.createElement("style");
        stylesheet.setAttribute("data-vitanova-styles", "bundled");
        stylesheet.textContent = embeddedCss;
        this.element.appendChild(stylesheet);
        this.stage = document.createElement("div");
        this.stage.className = "vitanova-stage";
        this.element.appendChild(this.stage);
        (window as any).VITANOVA_MAP = geometry; // Geographic SHAPES, not commercial data.
    }

    public update(options: VisualUpdateOptions): void {
        const width = Math.max(0, options.viewport.width);
        const height = Math.max(0, options.viewport.height);
        this.element.style.width = width + "px";
        this.element.style.height = height + "px";
        const scale = Math.max(0.01, Math.min(width / this.canvasWidth, height / this.canvasHeight));
        this.stage.style.transform = `translate(${Math.max(0,(width-this.canvasWidth*scale)/2)}px, ${Math.max(0,(height-this.canvasHeight*scale)/2)}px) scale(${scale})`;

        const model = readModelData(options.dataViews?.[0]);
        if (model.missing.length || !model.rowCount) {
            this.cleanup?.(); this.cleanup = undefined; this.activeDataSignature = "";
            renderMarkup(this.stage, `<div style="padding:35px;font:22px Segoe UI;color:#173e56">
                <h2>VitaNova · Modelo semántico</h2><p>Conecta los campos del modelo para visualizar los datos.</p>
                <p style="font-size:14px;line-height:1.6">${model.missing.length ? model.missing.map(r => {
                    const i = ["yearMonth","productKey","brand","therapy","marketKey","country","region","channelKey","channel","netSales","cogs","units","budgetSales","budgetCogs","budgetUnits","forecastSales","forecastCogs"].indexOf(r);
                    return expectedBindings[i];
                }).join(" · ") : "Sin registros en el contexto actual."}</p></div>`);
            return;
        }
        if (model.truncated) {
            renderMarkup(this.stage, `<div style="padding:40px;color:#a33;font:24px Segoe UI">Datos incompletos: Power BI ha limitado las filas enviadas al visual. Reduce el contexto o el grano.</div>`);
            return;
        }
        if (!model.data) return;
        const signature = JSON.stringify(model.data);
        if (signature === this.activeDataSignature) return; // Pure viewport resize: do not reset filters.
        this.cleanup?.();
        renderMarkup(this.stage, layout);
        (window as any).VITANOVA_DATA = model.data; // Live DataView projection, never hardcoded facts.
        this.cleanup = mountVitaNova(
            filters => this.publishDimensionFilters(filters),
            this.savedState,
            state => { this.savedState = state; }
        );
        this.activeDataSignature = signature;
    }

    /** Native model filters allow other Power BI visuals to react to selections.
     *  A reporting-month cutoff remains local because the dashboard uses YTD rows.
     */
    private publishDimensionFilters(filters: Record<string, string>): void {
        const targets: Record<string, {table: string; column: string}> = {
            therapy: {table: "DimProduct", column: "TherapeuticArea"},
            brand: {table: "DimProduct", column: "Brand"},
            market: {table: "DimMarket", column: "MarketKey"},
            region: {table: "DimMarket", column: "Region"},
            channel: {table: "DimChannel", column: "ChannelKey"}
        };
        const nativeFilters = Object.keys(targets).filter(k => filters[k] && filters[k] !== "ALL")
            .map(k => ({
                $schema: "http://powerbi.com/product/schema#basic",
                target: targets[k],
                operator: "In",
                values: [filters[k]],
                filterType: 1
            }));
        if (nativeFilters.length) {
            this.host.applyJsonFilter(nativeFilters as any, "general", "filter", powerbi.FilterAction.merge);
            this.hasNativeFilter = true;
        } else if (this.hasNativeFilter) {
            this.host.applyJsonFilter(null as any, "general", "filter", powerbi.FilterAction.remove);
            this.hasNativeFilter = false;
        }
    }

    public destroy(): void {
        this.cleanup?.();
        // Do not call applyJsonFilter here; filters are report state and the host owns their lifecycle.
    }
}
