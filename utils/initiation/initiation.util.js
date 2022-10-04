const { initStyle } = require("../../configs");
const GetIndices = require("../GetIndices/GetIndices.util");
const GetTraces = require("../GetTraces/GetTraces.util");
const BuildConnectivityData = require("../BuildConnectivityData/BuildConnectivityData.util");
const RestructureTrace = require("../RestructureTrace/RestructureTrace.util");
const StringDate2Timestamp = require("../StringDate2Timestamp/StringDate2Timestamp.util");
const UpdatedAt = require("../UpdatedAt/UpdatedAt.util");
const UpdateMetrics = require("../UpdateMetrics/UpdateMetrics.util");
const GetLastMetrics = require("../GetLastMetrics/GetLastMetrics.util");
const PostInstanceName = require("../PostInstanceName/PostInstanceName.util");
const PostResponseTime = require("../PostResponseTime/PostResponseTime.util");
const PostRequest = require("../PostRequest/PostRequest.util");
const PostRequestError = require("../PostRequestError/PostRequestError.util");
const logger = require("../logger/logger.util");
const PostInstanceGroup = require("../PostInstanceGroup/PostInstanceGroup.util");
const { writeFileSync } = require("fs");

async function elasticsearch() {
  logger.info("initiating with elasticsearch");
  UpdatedAt(0);
  writeFileSync("data/LastValue.json", JSON.stringify({}));
  const indices = await GetIndices();
  if (!indices) return logger.info("no jaeger indices found");
  for (let i = 0; i < indices.length; i++) {
    const index = indices[i];
    const indexDate = index.replace("jaeger-span-", "");
    for (let j = 1; j <= 24; j++) {
      const param = {
        indexDate,
        time: {
          gt:
            (StringDate2Timestamp(indexDate) + 60 * 60 * (j - 1) * 1000) * 1000,
          lte: (StringDate2Timestamp(indexDate) + 60 * 60 * j * 1000) * 1000,
        },
      };
      const traces = await GetTraces(param);
      const restructuredTraces = RestructureTrace(traces);
      const connectivityData = BuildConnectivityData(restructuredTraces);
      UpdateMetrics(connectivityData);
    }
  }
  return;
}

async function prometheus() {
  logger.info("initiating with prometheus");
  const lastMetrics = await GetLastMetrics();

  if (lastMetrics.length === 0) {
    logger.info("no jaeger metrics found");
    return await elasticsearch();
  }

  lastMetrics.forEach(
    ({ name, client, service, key, value, serviceGroup, clientGroup }) => {
      const label = { client, service, key };
      PostInstanceName({ client, service, serviceGroup, clientGroup, key });
      PostInstanceGroup({ serviceGroup, clientGroup });

      switch (name) {
        case "requests_total":
          PostRequest(value, label);
        case "requests_error_total":
          PostRequestError(value, label);
        case "response_time_total":
          PostResponseTime(value, label);
          break;
      }
    }
  );
  UpdatedAt(new Date() * 1000);
  return;
}

async function none() {}

const Initial = {
  elasticsearch,
  prometheus,
  none,
};

module.exports = Initial[initStyle];
