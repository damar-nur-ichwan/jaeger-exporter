require('dotenv').config()

const DEFAULT_JAEGER_EXPORTER_MONITORING = false

const isMonitoring = process.env['JAEGER_EXPORTER_MONITORING'] || DEFAULT_JAEGER_EXPORTER_MONITORING

module.exports = isMonitoring