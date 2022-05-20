const { initStyle } = require("../../configs");
const GetIndices = require("../GetIndices/GetIndices.util");
const GetTraces = require('../GetTraces/GetTraces.util');
const ReconditionTrace = require("../ReconditionTrace/ReconditionTrace.util");
const RestructureTrace = require("../RestructureTrace/RestructureTrace.util");
const ToTimestamp = require('../ToTimestamp/ToTimestamp.util');
const UpdateLast = require("../UpdateLast/UpdateLast.util");
const UpdateMetrics = require("../UpdateMetrics/UpdateMetrics.util");
const GetLastMetrics = require("../GetLastMetrics/GetLastMetrics.util");
const PostInstanceName = require("../PostInstanceName/PostInstanceName.util");
const PostResponseTime = require("../PostResponseTime/PostResponseTime.util");
const PostRequest = require("../PostRequest/PostRequest.util");
const PostRequestError = require("../PostRequestError/PostRequestError.util");

async function elasticsearch(){
    
    // set last timestamp to zero 0
    await UpdateLast(0)

    // Get indices
    const indices =  await GetIndices()

    // Loop by indices
    for(let i = 0; i < indices.length; i++){
        
        // Recondition value
        indexDate  = indices[i].replace('jaeger-span-','')

        // Loop by time
        for(let j=1; j <= 24; j++){

            // Define param
            const param = {
                indexDate,
                time: {
                    gt: ((ToTimestamp(indexDate.replace(/-/,' ')) + 3600 * (j-1)) * 1000) - 30000,
                    lte: (ToTimestamp(indexDate.replace(/-/,' ')) + 3600 * j) * 1000 + 30000,
                }
            }

            // Get Traces
            let traces  = await GetTraces(param)
    
            // Restructure Trace
            traces = RestructureTrace(traces)
            
            // Recondition Trace
            traces = ReconditionTrace(traces)

            // Update Metrics
            await UpdateMetrics(traces)

        }        
    };

    return 'initiated'
}

async function prometheus(){

    // Get last metrics
    const lastMetrics = await GetLastMetrics()

    // Update Metrics
    lastMetrics.map(({name, client, service, key, value}) => {

        // Variables
        const label = {client, service, key}
        
        //Post Instance Name
        PostInstanceName({client, service})
        
        // Update Metrics Value
        switch(name){
            case 'requests_total': PostRequest(value, label)
            case 'requests_error_total': PostRequestError(value, label)
            case 'response_time_total': PostResponseTime(value, label)
            break;
        }
    })

    //update last read
    await UpdateLast( parseInt(new Date / 1000))
}

async function none(){}

const Initial = {
    elasticsearch, 
    prometheus,
    none
}

module.exports = Initial[initStyle]