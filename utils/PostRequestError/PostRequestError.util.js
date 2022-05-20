const configs = require('../../configs')

module.exports = PostRequestError

function PostRequestError(value=0,label={}){
    const status = label.status
    label = {
        service: label.service,
        client: label.client,
        key: label.key
    }
    if(status === 'ERROR'){
        configs.metrics.requestErrorCounter.add(value,label)
    } else {
        configs.metrics.requestErrorCounter.add(value,label)
    }
}