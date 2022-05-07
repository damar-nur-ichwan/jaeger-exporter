const configs = require('../../configs')

module.exports = PostInstanceName

function PostInstanceName(label={}){
    configs.metrics.instanceName.add(0,{name: label.service})
    configs.metrics.instanceName.add(0,{name: label.client})
}