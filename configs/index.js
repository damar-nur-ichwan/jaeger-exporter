module.exports = {
    findSvcName: require('./findServiceName.config'),
    metrics: require('./metrics.config'),
    scrapeInterval: require('./scrapeInterval.config'),
    elasticsearch: require('./elasticsearch.config'),
    nodeEnv: require('./nodeEnv.config'),
    initStyle: require('./initStyle.config'),
    prometheus: require('./prometheus.config')
}