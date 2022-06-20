const { at } = require('../../configs/findServiceName.config')

const find =  require('../../configs').findSvcName

function RestructureTrace(data=[]){
    data.map( span => {
        let newTags = {}
        span.tags.forEach(tag => {
            if(tag.key === 'otel.status_code' || tag.key === 'span.kind' || tag.key === 'service.name'){
                newTags[tag.key] = tag.value
            }
            find.forEach((key)=>{
                if(tag.key === key){
                    newTags[tag.key] = tag.value
                }
            })
        })
        span.tags = newTags
    })
    data.map( span => {
        if(span.references.length > 0){
            span['parentID'] = span.references[0].spanID
        }
    })    
    return data
}

module.exports = RestructureTrace