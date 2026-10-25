// TEMPLATE · copy for each table, replacing both the name and type mapping.
// In Power BI Desktop create a Text parameter named pDataFolder, e.g. C:\\VitaNova\\data
// Avoid hardcoded user-specific absolute paths in queries.
let
    Source = Csv.Document(
        File.Contents(pDataFolder & "\\FactSales.csv"),
        [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]
    ),
    Headers = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Headers, {
        {"MonthStart", type date},
        {"ProductKey", type text}, {"MarketKey", type text}, {"ChannelKey", type text},
        {"GrossSalesEUR", type number}, {"DiscountsEUR", type number},
        {"ReturnsEUR", type number}, {"NetSalesEUR", type number},
        {"COGSEUR", type number}, {"Units", Int64.Type}
    }, "en-US")
in Typed
