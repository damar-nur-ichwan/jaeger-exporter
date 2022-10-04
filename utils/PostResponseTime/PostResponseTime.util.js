const configs = require("../../configs");

function PostResponseTime(
  value = 0,
  { service, client, serviceGroup, clientGroup, key }
) {
  let label = { service, client, key };
  if (serviceGroup) label["serviceGroup"] = serviceGroup;
  if (clientGroup) label["clientGroup"] = clientGroup;
  configs.metrics.responseTime.add(value, label);
}

module.exports = PostResponseTime;
