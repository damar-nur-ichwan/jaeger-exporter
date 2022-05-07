const configs = require('../../configs')

function PostResponseTime(value=0,label={}){
    label = {
        service: label.service,
        client: label.client,
        key: label.key
    }
    configs.metrics.responseTime.add(value,label)
}

module.exports = PostResponseTime