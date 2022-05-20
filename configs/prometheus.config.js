require('dotenv').config()

const prometheus = {
    host: process.env['PROMETHEUS_HOST'] || 'http://localhost:9090',
    instanceTarget: process.env['INSTANCE_TARGET'] || 'http://localhost:9464',
}

module.exports = prometheus