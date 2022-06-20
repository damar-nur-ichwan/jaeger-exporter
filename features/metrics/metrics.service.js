const { scrapeInterval, elasticsearch, initStyle, prometheus, nodeEnv } = require('../../configs')
const { initiation, GetIndices, logger, GetTraces, RestructureTrace, BuildConnectivityData, UpdateMetrics } = require('../../utils/utils')
const { PrometheusExporter } = require('@opentelemetry/exporter-prometheus');
const { endpoint, port } = PrometheusExporter.DEFAULT_OPTIONS;
const lastUpdated = require('../../data/UpdatedAt.json');

logger.info(`elasticsearch target endpoint: ${elasticsearch.host}`)
logger.info(`prometheus scrape endpoint: http://localhost:${port}${endpoint}`)

if(initStyle === 'prometheus'){
    logger.info(`prometheus target endpoint: ${prometheus.host}`)
    logger.info(`instance target: ${prometheus.instanceTarget}`)
}

async function Metrics(){
    logger.info('preparing')

    if(nodeEnv !== 'development') await new Promise(r => setTimeout(r, 30000));
    
    await initiation()

    logger.info('jaeger-exporter running')
    setInterval(() => running(), scrapeInterval)
}

module.exports = Metrics

async function running (){
    const indices = await GetIndices()
    if(!indices) return logger.info('no jaeger indices found')
    const lastDate = indices[indices.length -1].replace('jaeger-span-','')
    const traces = await GetTraces({
        indexDate: lastDate,
        time: {
            gt: lastUpdated
        }
    })
    const restructuredTraces = RestructureTrace(traces)
    const connectivityData = BuildConnectivityData(restructuredTraces)
    await UpdateMetrics(connectivityData)
}

async function isInitSucces(){
    const response = await axios('http://localhost:9464/metrics')
    if(response.data === "# no registered metrics") {
        logger.info("initiation failed")
        return false
    }
    return true
}