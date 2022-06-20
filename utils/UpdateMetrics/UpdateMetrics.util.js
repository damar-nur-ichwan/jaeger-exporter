const lastUpdated = require('../../data/UpdatedAt.json')
const PostInstanceName = require('../PostInstanceName/PostInstanceName.util')
const PostResponseTime = require('../PostResponseTime/PostResponseTime.util')
const PostRequest = require('../PostRequest/PostRequest.util')
const PostRequestError = require('../PostRequestError/PostRequestError.util')
const UpdatedAt = require('../UpdatedAt/UpdatedAt.util')

async function UpdateMetrics(traces = []){
    const timestamps = traces.map(span => span.timestamp)
    const labels = GetLabels(traces)
    const responseTimes = traces.map(span => parseInt(span.duration/1000))

    timestamps.forEach(async (timestamp, index) => {
        if(timestamp > lastUpdated){
                PostInstanceName(labels[index])
                PostResponseTime(responseTimes[index], labels[index])
                PostRequest(1, labels[index])
                if(labels[index].status === 'ERROR') PostRequestError(1, labels[index])
                else PostRequestError(0, labels[index])
                await UpdatedAt(timestamp)
        }
    })
    return
}

module.exports = UpdateMetrics

function GetLabels(traces = []){
        let newData = traces.map(span => {
                let schema = {
                        status: span.status 
                }
                switch (span.kind){
                        case 'server': {
                        schema['service'] = span.service
                        schema['client'] = span.external
                        }; break;
                        case 'client': {
                        schema['client'] = span.service
                        schema['service'] = span.external
                        }; break;
                }
                schema['key'] = `<${schema['client']}>,<${schema['service']}>`
                return schema
        })
        return newData
}