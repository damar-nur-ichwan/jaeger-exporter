const { scrapeInterval } = require('../../configs')
const { initial, GetIndices, logger, GetTraces, GetLast, RestructureTrace, ReconditionTrace, UpdateMetrics } = require('../../utils/utils')

async function Metrics(){
    // Initial
    logger.info('initiating')
    await initial()
    
    // setInterval
    setInterval(async () => {

            // Get Last Date of Indices
            let lastDate = await GetIndices()
            lastDate = lastDate[lastDate.length -1].replace('jaeger-span-','')
            
            // Get Traces
            let traces = await GetTraces({
                indexDate: lastDate,
                time: {
                    gt: await GetLast()
                }
            })

            // Restructure Trace
            traces = RestructureTrace(traces)
           
            // Recondition Trace
            traces = ReconditionTrace(traces)

            // Update metrics
            await UpdateMetrics(traces)
            
    }, scrapeInterval)

}

module.exports = Metrics