const { scrapeInterval, elasticsearch } = require('../../configs')
const { initial, GetIndices, logger, GetTraces, GetLast, RestructureTrace, ReconditionTrace, UpdateMetrics } = require('../../utils/utils')
const { PrometheusExporter } = require('@opentelemetry/exporter-prometheus');
const { endpoint, port } = PrometheusExporter.DEFAULT_OPTIONS;

logger.info(`elasticsearch target endpoint: ${elasticsearch.host}`)
logger.info(`prometheus scrape endpoint: http://localhost:${port}${endpoint}`)

async function Metrics(){
    
    //waiting
    logger.info('preparing')
    await new Promise(r => setTimeout(r, 60000));

    // Initial
    logger.info('initiating')
    await initial()
    
    // setInterval
    logger.info('running')
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