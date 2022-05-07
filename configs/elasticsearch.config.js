require('dotenv').config()

module.exports = {
    host: (process.env.ELASTICSEARCH_HOST || 'http://localhost:9200')
}