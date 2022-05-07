const GetIndices = require("../GetIndices/GetIndices.util");
const GetTraces = require('../GetTraces/GetTraces.util');
const ReconditionTrace = require("../ReconditionTrace/ReconditionTrace.util");
const RestructureTrace = require("../RestructureTrace/RestructureTrace.util");
const ToTimestamp = require('../ToTimestamp/ToTimestamp.util');
const UpdateLast = require("../UpdateLast/UpdateLast.util");
const UpdateMetrics = require("../UpdateMetrics/UpdateMetrics.util");

async function Initial(){
    
    // set last timestamp to zero 0
    await UpdateLast(0)

    // Get indices
    const indices =  await GetIndices()

    // Loop by indices
    for(let i = 0; i < indices.length; i++){
        
        // Recondition value
        indexDate  = indices[i].replace('jaeger-span-','')

        // Loop by time
        for(let j=1; j <= 24; j++){

            // Define param
            const param = {
                indexDate,
                time: {
                    gt: ((ToTimestamp(indexDate.replace(/-/,' ')) + 3600 * (j-1)) * 1000) - 30000,
                    lte: (ToTimestamp(indexDate.replace(/-/,' ')) + 3600 * j) * 1000 + 30000,
                }
            }

            // Get Traces
            let traces  = await GetTraces(param)
    
            // Restructure Trace
            traces = RestructureTrace(traces)
            
            // Recondition Trace
            traces = ReconditionTrace(traces)

            // Update Metrics
            await UpdateMetrics(traces)

        }        
    };

    return 'initiated'
}

module.exports = Initial