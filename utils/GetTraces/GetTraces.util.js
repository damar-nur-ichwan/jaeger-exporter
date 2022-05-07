require('dotenv').config()
const { default: axios } = require('axios')
const logger = require('../logger/logger.util')
const host = `${process.env.ELASTICSEARCH_HOST}`

async function GetTraces(param = {indexDate : '', time: {gt: 0, lte: 0}}){
    try{
        let body = {
            "query": {
                "range": {
                    "startTimeMillis": param.time
                }
            }
        }

        // Get data from elasticsearch
        let data = await axios.post(`http://${host}/jaeger-span-${param.indexDate}/_search?size=10000`,body)
        data = data.data.hits.hits.map((res) => res._source)

        if(data){
            return data
        }
        
    } catch (err){
        logger.error(err)
    }
}

module.exports = GetTraces
