const { MeterProvider } = require('@opentelemetry/sdk-metrics-base');
const { PrometheusExporter } = require('@opentelemetry/exporter-prometheus');
const exporter = new PrometheusExporter();

const meter = new MeterProvider({
  exporter,
  interval: 1000,
}).getMeter('prometheus');

const requestCounter = meter.createCounter('requests', {
  description: 'Counter of request'
})

const requestErrorCounter = meter.createCounter('requests_error', {
  description: 'Counter of request error'
})

const responseTime = meter.createCounter('response_time', {
  description: 'Counter of response time',
})

const instanceName = meter.createUpDownCounter('instance_name', {
  description: 'for instace name list',
})

module.exports = {
  requestCounter,
  requestErrorCounter,
  responseTime,
  instanceName
}