require('dotenv').config()

const DEFAULT_NODE_ENV = "production"

const nodeEnv = process.env['NODE_ENV'] || DEFAULT_NODE_ENV

module.exports = nodeEnv