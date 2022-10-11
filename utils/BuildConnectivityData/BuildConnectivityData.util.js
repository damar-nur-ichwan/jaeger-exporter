function BuildConnectivityData(trace = []) {
  const group = groupping(trace);
  const connectivityData = buildConnectivityData(group);
  return connectivityData;
}

module.exports = BuildConnectivityData;

function groupping(trace = []) {
  const clientSpans = [];
  const singleClientSpans = [];
  const singleServiceSpans = [];
  const coupleSpans = [];
  trace.forEach((span) => {
    span.tags["span.kind"] === "client" ? clientSpans.push(span) : false;
  });
  clientSpans.forEach((clientSpan) => {
    trace.forEach((span) => {
      const isCouple =
        span.references.length > 0 &&
        clientSpan.spanID === span.parentID &&
        span.tags["span.kind"] === "server";
      isCouple ? coupleSpans.push({ clientSpan, serviceSpan: span }) : false;
    });
  });
  trace.forEach((span) => {
    let isSingle = true;
    coupleSpans.forEach((coupleSpan) => {
      if (span.spanID === coupleSpan.spanID) isSingle = false;
    });
    if (isSingle) {
      if (span.tags["span.kind"] === "client") singleClientSpans.push(span);
      if (span.tags["span.kind"] === "server") singleServiceSpans.push(span);
    }
  });
  return { coupleSpans, singleClientSpans, singleServiceSpans };
}

function buildConnectivityData({
  coupleSpans,
  singleClientSpans,
  singleServiceSpans,
}) {
  coupleSpans = coupleSpanConnectivity(coupleSpans);
  singleClientSpans = singleClientSpansConnectivity(singleClientSpans);
  singleServiceSpans = singleServiceSpansConnectivity(singleServiceSpans);
  const output = [...coupleSpans, ...singleClientSpans, ...singleServiceSpans];
  output.sort((a, b) => a.startTime - b.startTime);
  return output;
}

function createKey(keys = []) {
  return keys
    .filter((value, index, self) => self.indexOf(value) === index)
    .map((value) => `<${value}>`)
    .reduce((a, b) => (a += "," + b));
}

function coupleSpanConnectivity(coupleSpans = []) {
  return coupleSpans.map(({ clientSpan, serviceSpan }) => {
    const client = clientSpan.tags["service.name"];
    const clientGroup = clientSpan.tags["service.group"]
      ? clientSpan.tags["service.group"]
      : serviceSpan.tags["service.group"];
    const service = serviceSpan.tags["db.name"]
      ? "db." + serviceSpan.tags["db.name"]
      : serviceSpan.tags["service.name"]
      ? serviceSpan.tags["service.name"]
      : "peer." + clientSpan.tags["peer.service"];
    const serviceGroup = serviceSpan.tags["service.group"]
      ? serviceSpan.tags["service.group"]
      : clientSpan.tags["service.group"];
    const key = createKey([client, service, clientGroup, serviceGroup]);
    const responseTime = parseInt(serviceSpan["duration"] / 1000);
    const startTime = clientSpan.startTime;
    const status = serviceSpan.tags["otel.status_code"] || "OK";
    return {
      startTime,
      client,
      service,
      clientGroup,
      serviceGroup,
      key,
      status,
      responseTime,
    };
  });
}

function singleClientSpansConnectivity(singleClientSpans = []) {
  return singleClientSpans.map((singleClientSpan) => {
    const client = singleClientSpan.tags["service.name"];
    const clientGroup = singleClientSpan.tags["service.group"];
    const service = singleClientSpan.tags["db.name"]
      ? "db." + singleClientSpan.tags["db.name"]
      : singleClientSpan.tags["http.host"]
      ? "http." + singleClientSpan.tags["http.host"]
      : "peer." + singleClientSpan.tags["peer.service"];
    const key = createKey([client, service, clientGroup]);
    const responseTime = parseInt(singleClientSpan["duration"] / 1000);
    const startTime = singleClientSpan.startTime;
    const status = singleClientSpan.tags["otel.status_code"] || "OK";
    return {
      startTime,
      client,
      service,
      clientGroup,
      key,
      status,
      responseTime,
    };
  });
}

function singleServiceSpansConnectivity(singleServiceSpans = []) {
  return singleServiceSpans.map((singleServiceSpan) => {
    const service = singleServiceSpan.tags["service.name"];
    const serviceGroup = singleServiceSpan.tags["service.group"];
    const userAgent =
      singleServiceSpan.tags["http.user_agent"] &&
      !singleServiceSpan.tags["http.user_agent"].includes(" ") &&
      singleServiceSpan.tags["http.user_agent"].includes(".")
        ? singleServiceSpan.tags["http.user_agent"]
        : false;
    const client = userAgent ? userAgent.split(".")[1] : "Client";
    const clientGroup = userAgent ? userAgent.split(".")[0] : false;

    const key = clientGroup
      ? createKey([client, service, serviceGroup, clientGroup])
      : createKey([client, service, serviceGroup]);
    const responseTime = parseInt(singleServiceSpan["duration"] / 1000);
    const startTime = singleServiceSpan.startTime;
    const status = singleServiceSpan.tags["otel.status_code"] || "OK";
    return {
      startTime,
      client,
      service,
      serviceGroup,
      key,
      status,
      responseTime,
    };
  });
}
