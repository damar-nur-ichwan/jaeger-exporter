const configs = require('../../configs')

module.exports = PostRequest

function PostRequest(value=0,label={}){
    label = {
        service: label.service,
        client: label.client,
        key: label.key
    }
    configs.metrics.requestCounter.add(value,label)
}