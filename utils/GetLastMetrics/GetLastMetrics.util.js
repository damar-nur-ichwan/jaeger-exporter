const { default: axios } = require("axios");
const { prometheus } =require('../../configs');
const { host, instanceTarget } = prometheus
const logger = require('../logger/logger.util')

async function GetLastMetrics(){

    try {
        const date = new Date, monthIndex = date.getMonth(), year = date.getFullYear()
        const now = parseInt(date / 1000), start = Math.ceil(new Date(year, monthIndex -1, 15, 1, 1, 1, 1) / 1000)
        const url = `${host}/api/v1/query_range?query={instance=%22${instanceTarget}%22}&start=${start}&end=${now}&step=1h`
        const data = await axios.get(url)
        
        let output = []
        data.data.data.result.map(({metric, values}) => {
            if(metric.client) output.push({
                name: metric.__name__,
                client: metric.client,
                key: metric.key,
                service: metric.service,
                value: parseInt(values[values.length -1][1])
            })
        })
        
        return output

    } catch (err) {
        logger.error('err')
    }
} 

module.exports = GetLastMetrics