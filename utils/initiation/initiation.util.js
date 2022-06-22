const { initStyle } = require("../../configs");
const GetIndices = require("../GetIndices/GetIndices.util");
const GetTraces = require('../GetTraces/GetTraces.util');
const BuildConnectivityData = require("../BuildConnectivityData/BuildConnectivityData.util");
const RestructureTrace = require("../RestructureTrace/RestructureTrace.util");
const StringDate2Timestamp = require('../StringDate2Timestamp/StringDate2Timestamp.util');
const UpdatedAt = require("../UpdatedAt/UpdatedAt.util");
const UpdateMetrics = require("../UpdateMetrics/UpdateMetrics.util");
const GetLastMetrics = require("../GetLastMetrics/GetLastMetrics.util");
const PostInstanceName = require("../PostInstanceName/PostInstanceName.util");
const PostResponseTime = require("../PostResponseTime/PostResponseTime.util");
const PostRequest = require("../PostRequest/PostRequest.util");
const PostRequestError = require("../PostRequestError/PostRequestError.util");
const logger = require("../logger/logger.util");
const { default: axios } = require("axios");
const PostInstanceGroup = require("../PostInstanceGroup/PostInstanceGroup.util");

async function elasticsearch(){
    logger.info('initiating with elasticsearch')
    await UpdatedAt(0)
    const indices =  await GetIndices()
    if(!indices) return logger.info('no jaeger indices found')
    
    indices.forEach(async index => {
        const indexDate  = index.replace('jaeger-span-','')
        for(let j = 1; j <= 24; j++){
            const param = {
                indexDate,
                time: {
                    gt: ((StringDate2Timestamp(indexDate.replace(/-/,' ')) + 3600 * (j-1)) * 1000) - 30000,
                    lte: (StringDate2Timestamp(indexDate.replace(/-/,' ')) + 3600 * j) * 1000 + 30000,
                }
            }
            const traces  = await GetTraces(param)
            const restructuredTraces = RestructureTrace(traces)
            const connectivityData = BuildConnectivityData(restructuredTraces)
            
            await UpdateMetrics(connectivityData)
        }        
    })
    const isInitSuccess = await checkMetrics()
    if(!isInitSuccess) await reinitiate(elasticsearch)
    return
}

async function prometheus(){
    logger.info('initiating with prometheus')
    const lastMetrics = await GetLastMetrics()

    if(lastMetrics.length === 0){
        logger.info('no jaeger metrics found')
        return await elasticsearch()
    }
    
    lastMetrics.forEach(({ name, client, service, key, value, serviceGroup, clientGroup }) => {
        const label = {client, service, key}
        PostInstanceName({ client, service, serviceGroup, clientGroup, key })
        PostInstanceGroup({serviceGroup, clientGroup})
        
        switch(name){
            case 'requests_total': PostRequest(value, label)
            case 'requests_error_total': PostRequestError(value, label)
            case 'response_time_total': PostResponseTime(value, label)
            break;
        }
    })

    await UpdatedAt(parseInt(new Date / 1000))
    
    const isInitSuccess = await checkMetrics()
    if(!isInitSuccess) await reinitiate(prometheus)
    return
}

async function none(){}

const Initial = {
    elasticsearch, 
    prometheus,
    none
}

module.exports = Initial[initStyle]


async function checkMetrics(){
    try{
        const response = await axios('http://localhost:9464/metrics')
        if(response.data === "# no registered metrics") {
            logger.info("initiation failed")
            return false
        }
        return true
    } catch (err) {
        logger.error(err)
        process.exit()
    }
}

async function reinitiate(style = async function(){ process.exit() }){
    if(!style) return logger.error('reinitiate parameter is undefined')
    logger.info("reinitiate")
    await new Promise(r => setTimeout(r, 5000));
    await style()
}