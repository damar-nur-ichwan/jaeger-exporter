const find =  require('../../configs').findSvcName
function RestructureTrace(data=[]){
    
    // Restructure tags
    data.map( span => {
        let newTags = {}
        span.tags.map( tag => {
            if(tag.key === 'otel.status_code' || tag.key === 'span.kind' || tag.key === 'service.name'){
                newTags[tag.key] = tag.value
            }
            find.map((key)=>{
                if(tag.key === key){
                    newTags[tag.key] = tag.value
                }
            })
        })
        span.tags = newTags
    })

    //Restructure references
    data.map( span => {
        if(span.references.length > 0){
            span['parentID'] = span.references[0].spanID
        }
    })

    // Delete unused data
    data.map(span => {
        delete span.flags
        delete span.operationName
        delete span.startTime
        delete span.logs
        delete span.process
        delete span.references
    })
    
    return data
}

module.exports = RestructureTrace