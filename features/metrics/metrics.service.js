const {
  scrapeInterval,
  elasticsearch,
  initStyle,
  prometheus,
  nodeEnv,
} = require("../../configs");
const {
  initiation,
  GetIndices,
  logger,
  GetTraces,
  RestructureTrace,
  BuildConnectivityData,
  UpdateMetrics,
} = require("../../utils/utils");
const { PrometheusExporter } = require("@opentelemetry/exporter-prometheus");
const { endpoint, port } = PrometheusExporter.DEFAULT_OPTIONS;
const { readFileSync } = require("fs");
const { default: axios } = require("axios");

logger.info(`elasticsearch target endpoint: ${elasticsearch.host}`);
logger.info(`prometheus scrape endpoint: http://localhost:${port}${endpoint}`);

if (initStyle === "prometheus") {
  logger.info(`prometheus target endpoint: ${prometheus.host}`);
  logger.info(`instance target: ${prometheus.instanceTarget}`);
}

async function checkElasticsearchOnStartUp() {
  try {
    await axios.get(`${elasticsearch.host}/_cat`);
    return true;
  } catch (err) {
    return err.isAxiosError ? false : true;
  }
}
async function Metrics() {
  const response = await checkElasticsearchOnStartUp();
  if (!response && nodeEnv !== "development") {
    logger.info("waiting for elasticsearch to be ready in 30 seconds");
    await new Promise((r) => setTimeout(r, 30000));
  }
  await initiation();
  logger.info("jaeger-exporter running");
  setInterval(() => running(), scrapeInterval);
}

module.exports = Metrics;

async function running() {
  const indices = await GetIndices();
  if (!indices) return logger.info("no jaeger indices found");
  const lastDate = indices[indices.length - 1].replace("jaeger-span-", "");
  const lastUpdated = JSON.parse(readFileSync("data/UpdatedAt.json"));
  const traces = await GetTraces({
    indexDate: lastDate,
    time: {
      gt: lastUpdated,
    },
  });
  const restructuredTraces = RestructureTrace(traces);
  const connectivityData = BuildConnectivityData(restructuredTraces);
  UpdateMetrics(connectivityData);
}
