
const { default: axios } = require('axios')
const { host } = require('../../configs')['elasticsearch']
const logger = require('../logger/logger.util')

async function GetIndices(){
    try {
        const response = await axios.get(`${host}/_cat/indices/jaeger-span*`)
        let indices = response.data
        if(!indices) return false
        indices =  indices.split('jaeger-span-')
        indices = indices.map(element => `jaeger-span-${element.slice(0,10)}`)
        indices.sort()
        indices.pop()
        return indices
    } catch (err){
        logger.error('elasticsearch not connected')
        process.exit()

    }
}

module.exports = GetIndices