const PostInstanceName = require("../PostInstanceName/PostInstanceName.util");
const PostInstanceGroup = require("../PostInstanceGroup/PostInstanceGroup.util");
const PostResponseTime = require("../PostResponseTime/PostResponseTime.util");
const PostRequest = require("../PostRequest/PostRequest.util");
const PostRequestError = require("../PostRequestError/PostRequestError.util");
const UpdatedAt = require("../UpdatedAt/UpdatedAt.util");
const { readFileSync, writeFileSync } = require("fs");

function UpdateMetrics(traces = []) {
  let lastUpdated = JSON.parse(readFileSync("data/UpdatedAt.json"));
  let lastValue = JSON.parse(readFileSync("data/LastValue.json"));
  if (traces.length > 0) {
    for (let i = 0; i < traces.length; i++) {
      const span = traces[i];
      if ((span.startTime >= lastUpdated) & (span !== lastValue)) {
        lastValue === span;
        lastUpdated = span.startTime;
        UpdatedAt(span.startTime);
        writeFileSync("data/LastValue.json", JSON.stringify(span));
        PostInstanceName(span);
        PostInstanceGroup(span);
        PostResponseTime(span.responseTime, span);
        PostRequest(1, span);
        if (span.status === "ERROR") PostRequestError(1, span);
        else PostRequestError(0, span);
      }
    }
  }
  return;
}

module.exports = UpdateMetrics;
