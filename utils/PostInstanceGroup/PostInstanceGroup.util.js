const configs = require('../../configs')
const { instanceGroup } = configs.metrics

module.exports = PostInstanceGroup

function PostInstanceGroup({ serviceGroup, clientGroup }){
    if (serviceGroup) instanceGroup.add(0,{name: serviceGroup})
    if (clientGroup) instanceGroup.add(0,{name: clientGroup})
}