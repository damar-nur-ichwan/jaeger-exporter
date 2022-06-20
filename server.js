const { monitoring } = require('./configs')
const { metrics } = require('./features/features')

if(monitoring) require('suprboard-tracer')()

metrics()