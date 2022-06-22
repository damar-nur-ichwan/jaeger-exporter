const configs = require('../../configs')

module.exports = PostRequest

function PostRequest(value=0, { service, client, serviceGroup, clientGroup, key }){
    let label = { service, client, key }
    if(serviceGroup) label['serviceGroup'] = serviceGroup
    if(clientGroup) label['clientGroup'] = clientGroup
    configs.metrics.requestCounter.add(value,label)
}