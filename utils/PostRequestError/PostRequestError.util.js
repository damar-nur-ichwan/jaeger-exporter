const configs = require('../../configs')

module.exports = PostRequestError

function PostRequestError(value=0,label={}){
    label = {
        service: label.service,
        client: label.client,
        key: label.key
    }
    configs.metrics.requestErrorCounter.add(value,label)
}