const { default: axios } = require('axios')
const logger = require('../logger/logger.util')
const { host } = require('../../configs')['elasticsearch']

async function GetTraces(param = {indexDate : '', time: {gt: 0, lte: 0}}){
    const url = `${host}/jaeger-span-${param.indexDate}/_search?size=10000`
    const body = {
        "query": {
            "range": {
                "startTimeMillis": param.time
            }
        }
    }
    try{
        const response = await axios.post(url,body)
        const traces = response.data.hits.hits.map(res => res._source)
        return traces
    } catch (err){
        logger.error(err)
        return false
    }
}

module.exports = GetTraces
