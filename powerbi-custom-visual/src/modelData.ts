/** Convert one Power BI DataView.table into the same in-memory tabular shape used by
 *  VitaNova's drawing functions. No sales, budget or forecast figures are embedded.
 *  Every numerical fact comes from a DAX measure bound in the visual's field wells.
 */
const fields = ["yearMonth", "productKey", "brand", "therapy", "marketKey", "country",
    "region", "channelKey", "channel", "netSales", "cogs", "units", "budgetSales",
    "budgetCogs", "budgetUnits", "forecastSales", "forecastCogs"] as const;

export const expectedBindings = [
    "DimDate[YearMonth]", "DimProduct[ProductKey]", "DimProduct[Brand]",
    "DimProduct[TherapeuticArea]", "DimMarket[MarketKey]", "DimMarket[Country]",
    "DimMarket[Region]", "DimChannel[ChannelKey]", "DimChannel[Channel]",
    "_Measures[Net Sales]", "_Measures[COGS]", "_Measures[Units]",
    "_Measures[Sales Budget]", "_Measures[COGS Budget]", "_Measures[Units Budget]",
    "_Measures[Forecast Monthly]", "_Measures[Forecast COGS Monthly]"
];

interface Column { roles?: {[key:string]: boolean}; }
interface Table { columns: Column[]; rows?: Array<Array<unknown>>; }
interface View { table?: Table; metadata?: {segment?:unknown}; }

const numeric = (v: unknown): number => (typeof v === "number" && Number.isFinite(v)) ? v : 0;
const str = (v: unknown): string => (v === null || v === undefined) ? "" : String(v);
const yearMonth = (v: unknown): string => {
    const s = str(v);
    // Column DimDate[YearMonth] is YYYY-MM; allow Date values defensively.
    return /^\d{4}-\d{2}$/.test(s) ? s : s.slice(0, 7);
};

export function readModelData(view: View | undefined): {data?:any; missing:string[]; rowCount:number; truncated:boolean} {
    const table = view?.table;
    const columns = table?.columns || [];
    const idx = Object.fromEntries(fields.map(name => [name, columns.findIndex(c => !!c.roles?.[name])])) as {[key:string]:number};
    const missing = fields.filter(name => idx[name] < 0);
    if (missing.length) return {missing, rowCount:table?.rows?.length || 0, truncated:!!view?.metadata?.segment};
    const products = new Map<string,any>(), markets = new Map<string,any>(), channels = new Map<string,any>();
    const sales: any[] = [], budget: any[] = [], forecast: any[] = [];
    const rows = table?.rows || [];
    let lastClosedMonth = "";
    const seen = new Set<string>();
    for (const row of rows) {
        const get = (name:string): unknown => row[idx[name]];
        const ym = yearMonth(get("yearMonth"));
        const pk = str(get("productKey"));
        const mk = str(get("marketKey"));
        const ck = str(get("channelKey"));
        if (!/^20\d{2}-(0[1-9]|1[0-2])$/.test(ym) || !pk || !mk || !ck) continue;
        products.set(pk, {ProductKey:pk, Brand:str(get("brand")), TherapeuticArea:str(get("therapy"))});
        markets.set(mk, {MarketKey:mk, Country:str(get("country")), Region:str(get("region"))});
        channels.set(ck, {ChannelKey:ck, Channel:str(get("channel"))});
        // A table visual may repeat a row across incremental data segments.
        // Each dimensional tuple must be unique; duplicated measure tuples would double the dashboard.
        const key = [ym, pk, mk, ck].join("|");
        if (seen.has(key)) continue;
        seen.add(key);
        if (get("netSales") !== null && get("netSales") !== undefined) {
            sales.push([ym, pk, mk, ck, numeric(get("netSales")),
                numeric(get("cogs")), numeric(get("units"))]);
            if (ym > lastClosedMonth) lastClosedMonth = ym;
        }
        if (get("budgetSales") !== null && get("budgetSales") !== undefined) {
            budget.push([ym, pk, mk, ck, numeric(get("budgetSales")),
                numeric(get("budgetCogs")), numeric(get("budgetUnits"))]);
        }
        if (get("forecastSales") !== null && get("forecastSales") !== undefined) {
            forecast.push([ym, pk, mk, ck, numeric(get("forecastSales")),
                numeric(get("forecastCogs")), "Projection"]);
        }
    }
    const data = {
        meta: {brand:"VitaNova Pharmaceuticals",lastClosedMonth:lastClosedMonth || "2026-09",currency:"EUR",
            synthetic:true,scenarioMultipliers:{baseline:1,upside:1.08,downside:0.9}},
        products:[...products.values()],markets:[...markets.values()],channels:[...channels.values()],
        sales,budget,forecast
    };
    return {data, missing:[],rowCount:rows.length,truncated:!!view?.metadata?.segment};
}
