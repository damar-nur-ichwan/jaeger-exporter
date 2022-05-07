
let find = require('../../configs').findSvcName

function ReconditionTrace (trace=[]){
    
    // Grouping
    let servers = [], clients = []
    trace.map((span) => {
        switch(span.tags['span.kind']){
            case 'server': servers.push(span); break;
            case 'client': clients.push(span); break; 
        }
    })

    // Declare new Data
    let newData = []

    // Conditioning
    clients.map((client) => {

        // If client id has server parentId
        let check = 0
        servers.map(server=>{
            if(server.parentID && client.spanID === server.parentID){
                client['external'] = server.tags['service.name']
                newData.push(client)
                check++
            }
        })
    
        // If client id has not server parentId
        if(check === 0){
            find.map(val=>{
                if(client.tags[val]){
                    client['external'] = `${val.split('.')[0]}: ${client.tags[val]}`
                    newData.push(client)
                }
            })
        }
    })
  
    // If server parentId has not clientId
    servers.map(server=>{
        let check = 0
        clients.map(client=>{
            if(server.parentID && server.parentID === client.spanID){
                check++
            }
        })
        if(check === 0){
            server['external'] = 'Client'
            newData.push(server)
        }
    })

    // Delete the symbols '()' at the Service Name && resimple output
    let resimple = []
    newData = newData.map(span=>{
        if(span.tags['service.name']){
            let newString = '', service = '', external=''
            span.tags['service.name'].split('(').map(v=>{newString += v})
            newString.split(')').map(v=> service += v)
            newString = ''
            span.external.split('(').map(v=>{newString += v})
            newString.split(')').map(v=> external += v)

            resimple.push({
                kind: span.tags['span.kind'],
                service,
                timestamp: span.startTimeMillis,
                duration: span.duration,
                status: span.tags['otel.status_code'] === 'ERROR' ? 'ERROR':'OK',
                external
            })
        }
    })

    return resimple
}

module.exports = ReconditionTrace