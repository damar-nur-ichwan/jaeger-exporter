
const { default: axios } = require('axios')
const { host } = require('../../configs')['elasticsearch']
const logger = require('../logger/logger.util')

async function GetIndices(){
    // Try
    try {
        // Get Data from Elasticsearch
        let data = await axios.get(`${host}/_cat/indices/jaeger-span*`)
        data = data.data

        // Get index name
        data =  data.split('jaeger-span-')
        .map(element =>{
            return `jaeger-span-${element.slice(0,10)}`
        })
        data.sort()
        data.pop()

        // Return
        return data
    }

    // Catch
    catch (err){
        logger.error(err)

        // Retry
        setTimeout(() => {
            GetIndices()
        }, 15000);
    }
}

module.exports = GetIndices