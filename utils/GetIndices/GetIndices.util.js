require('dotenv').config()
const { default: axios } = require('axios')
const host = `${process.env.ELASTICSEARCH_HOST}`
const logger = require('../logger/logger.util')

async function GetIndices(){
    // Try
    try {
        // Get Data from Elasticsearch
        let data = await axios.get(`http://${host}/_cat/indices/jaeger-span*`)
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
    }
}

module.exports = GetIndices