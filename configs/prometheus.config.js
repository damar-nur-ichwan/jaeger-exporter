require('dotenv').config()

const DEFAULT_PROMETHEUS_HOST = "http://localhost:9090"
const DEFAULT_INSTANCE_TARGET = "http://localhost:9464"

const prometheus = {
    host: process.env['PROMETHEUS_HOST'] || DEFAULT_PROMETHEUS_HOST,
    instanceTarget: process.env['INSTANCE_TARGET'] || DEFAULT_INSTANCE_TARGET,
}

module.exports = prometheus