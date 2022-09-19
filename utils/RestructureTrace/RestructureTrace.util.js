const find = require("../../configs").findSvcName;

function RestructureTrace(data = []) {
  data.map((span) => {
    let newTags = {};
    span.tags.forEach((tag) => {
      if (
        tag.key === "otel.status_code" ||
        tag.key === "span.kind" ||
        tag.key === "service.name" ||
        tag.key === "http.user_agent"
      ) {
        newTags[tag.key] = tag.value;
      }
      if (tag.key === "serviceGroup")
        span["process"]["serviceGroup"] = tag.value;
      find.forEach((key) => {
        if (tag.key === key) {
          newTags[tag.key] = tag.value;
        }
      });
    });
    span.tags = newTags;
  });
  data.map((span) => {
    if (span.references.length > 0)
      span["parentID"] = span.references[0].spanID;
    span.process.tags.forEach((tag) => {
      if (tag.key === "serviceGroup")
        span["process"]["serviceGroup"] = tag.value;
    });
  });
  return data;
}

module.exports = RestructureTrace;
