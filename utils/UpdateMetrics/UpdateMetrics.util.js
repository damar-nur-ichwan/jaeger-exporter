const GetTimestamp = require('../GetTimestamp/GetTimestamp.util')
const GetLabel = require('../GetLabel/GetLabel.util')
const GetResponseTime = require('../GetResponseTime/GetResponseTime.util')
const GetLast = require('../GetLast/GetLast.util')
const PostInstanceName = require('../PostInstanceName/PostInstanceName.util')
const PostResponseTime = require('../PostResponseTime/PostResponseTime.util')
const PostRequest = require('../PostRequest/PostRequest.util')
const PostRequestError = require('../PostRequestError/PostRequestError.util')
const UpdateLast = require('../UpdateLast/UpdateLast.util')

async function UpdateMetrics(traces = []){

    //get timestamp
    let timestamp = GetTimestamp(traces)
    
    //get labels
    let labels = GetLabel(traces)
    
    //get values
    let responseTime = GetResponseTime(traces)
   
    for(let i = 0; i < timestamp.length; i++){

            //get last
            let lastUpdate = await GetLast()
           
            if(timestamp[i] > lastUpdate){

                    //Post Instance Name
                    PostInstanceName(labels[i])
                    
                    //post restponse time
                    PostResponseTime(responseTime[i],labels[i])

                    //Post Request Count
                    PostRequest(1,labels[i])

                    //Post Request Error Count
                    PostRequestError(1,labels[i])

                    //update last read
                    await UpdateLast(timestamp[i])
            }
    }

    return 'Metrics updated'
}

module.exports = UpdateMetrics