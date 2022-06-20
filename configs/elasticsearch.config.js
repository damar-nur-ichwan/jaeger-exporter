require('dotenv').config()

const DEFAULT_ELASTICSEARCH_HOST = 'http://localhost:9200'

module.exports = {
    host: process.env.ELASTICSEARCH_HOST || DEFAULT_ELASTICSEARCH_HOST
}