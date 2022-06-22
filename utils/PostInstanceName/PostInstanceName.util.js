const configs = require('../../configs')

module.exports = PostInstanceName

function PostInstanceName({ service, client, serviceGroup, clientGroup, key }){
    if(serviceGroup) configs.metrics.instanceName.add(0, {name: service, group: serviceGroup, key })
    else configs.metrics.instanceName.add(0,{name: service, key })

    if(clientGroup) configs.metrics.instanceName.add(0, {name: client, group: clientGroup, key })
    else configs.metrics.instanceName.add(0,{name: client, key })
}