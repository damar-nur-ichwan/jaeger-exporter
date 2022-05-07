const RestructureTrace = require('./RestructureTrace.util')

const rawData = [
    {
      traceID: '70a6959ccb30fb5c62bd63b279bfc3a0',
      spanID: '8e3d6dbc0370a1ee',
      flags: 1,
      operationName: 'request handler - /',
      references: [
        {
          refType: 'CHILD_OF',
          traceID: '342c1185614d572c5f81e4a779304f84',
          spanID: '65f717dcbaecc7ae'
        }
      ],
      startTime: 1650352245810864,
      startTimeMillis: 1650352245810,
      duration: 141,
      tags: [
        { key: 'http.url', type: 'string', value: 'http://localhost:8090/' },
        { key: 'http.host', type: 'string', value: 'localhost:8090' },
        { key: 'net.host.name', type: 'string', value: 'localhost' },
        { key: 'http.method', type: 'string', value: 'GET' },
        { key: 'http.target', type: 'string', value: '/' },
        { key: 'http.user_agent', type: 'string', value: 'axios/0.26.1' },
        { key: 'http.flavor', type: 'string', value: '1.1' },
        { key: 'net.transport', type: 'string', value: 'ip_tcp' },
        { key: 'net.host.ip', type: 'string', value: '::ffff:127.0.0.1' },
        { key: 'net.host.port', type: 'float64', value: '8090' },
        { key: 'net.peer.ip', type: 'string', value: '::ffff:127.0.0.1' },
        { key: 'net.peer.port', type: 'float64', value: '63111' },
        { key: 'http.status_code', type: 'float64', value: '200' },
        { key: 'http.status_text', type: 'string', value: 'OK' },
        { key: 'http.route', type: 'string', value: '' },
        { key: 'otel.status_code', type: 'string', value: 'OK' },
        { key: 'span.kind', type: 'string', value: 'server' },
        { key: 'service.name', type: 'string', value: 'Aplikasi 10' },
        { key: 'telemetry.sdk.language', type: 'string', value: 'nodejs' },
        { key: 'telemetry.sdk.name', type: 'string', value: 'opentelemetry' },
        { key: 'telemetry.sdk.version', type: 'string', value: '0.25.0' },
        {
          key: 'otel.library.name',
          type: 'string',
          value: '@opentelemetry/instrumentation-http'
        },
        { key: 'otel.library.version', type: 'string', value: '0.27.0' },
        { key: 'internal.span.format', type: 'string', value: 'proto' }
      ],
      logs: [],
      process: { serviceName: 'Aplikasi 10', tags: [] }
    },
    {
      traceID: '70a6959ccb30fb5c62bd63b279bfc3a0',
      spanID: 'ab21171b158a232e',
      flags: 1,
      operationName: 'GET /',
      references: [],
      startTime: 1650352245765858,
      startTimeMillis: 1650352245765,
      duration: 56679,
      tags: [
        { key: 'http.route', type: 'string', value: '/' },
        { key: 'express.name', type: 'string', value: 'expressInit' },
        { key: 'express.type', type: 'string', value: 'middleware' },
        { key: 'service.name', type: 'string', value: 'Aplikasi 10' },
        { key: 'telemetry.sdk.language', type: 'string', value: 'nodejs' },
        { key: 'telemetry.sdk.name', type: 'string', value: 'opentelemetry' },
        { key: 'telemetry.sdk.version', type: 'string', value: '0.25.0' },
        {
          key: 'otel.library.name',
          type: 'string',
          value: '@opentelemetry/instrumentation-express'
        },
        { key: 'otel.library.version', type: 'string', value: '0.28.0' },
        { key: 'internal.span.format', type: 'string', value: 'proto' }
      ],
      logs: [],
      process: { serviceName: 'Aplikasi 10', tags: [] }
    }
]

test('Restructure Trace', async () => {
    const data = await RestructureTrace(rawData)
    data.map((span) => {
        expect(span.tags.length).toBeUndefined();
        expect(span.flags).toBeUndefined();
        expect(span.operationName).toBeUndefined();
        expect(span.startTime).toBeUndefined();
        expect(span.logs).toBeUndefined();
        expect(span.process).toBeUndefined();
        expect(span.references).toBeUndefined();
    })
});