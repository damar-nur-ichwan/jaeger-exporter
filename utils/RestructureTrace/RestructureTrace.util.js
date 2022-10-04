const find = require("../../configs").findSvcName;

function RestructureTrace(data = []) {
  return data
    .map((span) => {
      let newTags = {};
      span.tags.forEach((tag) => {
        if (
          tag.key === "otel.status_code" ||
          tag.key === "span.kind" ||
          tag.key === "service.name" ||
          tag.key === "http.user_agent" ||
          tag.key === "service.group" ||
          tag.key === "serviceGroup" ||
          tag.key == "peer.service"
        ) {
          newTags[tag.key === "serviceGroup" ? "service.group" : tag.key] =
            tag.value;
        }
        find.forEach((key) => {
          if (tag.key === key) {
            newTags[tag.key] = tag.value;
          }
        });
      });
      span.tags = span ? newTags : span;
      return span;
    })
    .map((span) => {
      if (span && span.references.length > 0)
        span["parentID"] = span.references[0].spanID;
      span.process.tags.forEach((tag) => {
        if (tag.key === "service.group" || tag.key === "serviceGroup")
          span["tags"]["service.group"] = tag.value;
      });
      if (span && span.process.serviceName)
        span["tags"]["service.name"] = span.process.serviceName;
      return span;
    });
}

module.exports = RestructureTrace;
