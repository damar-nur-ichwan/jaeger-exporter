const lastUpdated = require('../../data/UpdatedAt.json')
const PostInstanceName = require('../PostInstanceName/PostInstanceName.util')
const PostInstanceGroup = require('../PostInstanceGroup/PostInstanceGroup.util')
const PostResponseTime = require('../PostResponseTime/PostResponseTime.util')
const PostRequest = require('../PostRequest/PostRequest.util')
const PostRequestError = require('../PostRequestError/PostRequestError.util')
const UpdatedAt = require('../UpdatedAt/UpdatedAt.util')

async function UpdateMetrics(traces = []){
    const timestamps = traces.map(span => span.timestamp)
    const labels = GetLabels(traces)
    const responseTimes = traces.map(span => parseInt(span.duration / 1000))

    timestamps.forEach(async (timestamp, index) => {
        if(timestamp > lastUpdated){
                PostInstanceName(labels[index])
                PostInstanceGroup(labels[index])
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
        let newData = traces.map(({ kind, status, service, external, serviceGroup, externalGroup }) => {

                let schema = {
                        status
                }

                switch (kind){
                        case 'server': {
                                schema['service'] = service
                                schema['client'] = external
                                if(serviceGroup) schema['serviceGroup'] = serviceGroup
                                if(externalGroup) schema['clientGroup'] = externalGroup
                        }; break;
                        case 'client': {
                                schema['client'] = service
                                schema['service'] = external
                                if(serviceGroup) schema['clientGroup'] = serviceGroup
                                if(externalGroup) schema['serviceGroup'] = externalGroup
                        }; break;
                }

                schema['key'] = `<${schema['client']}>`
                if(schema['client'] !== schema['service']) schema['key'] += `,<${schema['service']}>`
                if(serviceGroup) schema['key'] += `,<${serviceGroup}>`
                if(externalGroup && externalGroup !== serviceGroup) schema['key'] += `,<${externalGroup}>`
                return schema
        })
        return newData
}