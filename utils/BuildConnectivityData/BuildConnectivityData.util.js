
let find = require('../../configs').findSvcName

function BuildConnectivityData (trace=[]){
    const { servers, clients } = groupping(trace)
    const connectivityData = buildConnectivityData(clients, servers)
    return connectivityData
}

module.exports = BuildConnectivityData

function groupping(trace = []){
    let servers = [], clients = []
    trace.forEach((span) => {
        switch(span.tags['span.kind']){
            case 'server': servers.push(span); break;
            case 'client': clients.push(span); break; 
        }
    })
    
    return { servers, clients }
}

function buildConnectivityData(clients = [], servers = []){
    let connectivityData = []

    clients.map((client) => {

        // If client id has server parentId
        let check = false
        servers.map(server=>{
            if(server.parentID && client.spanID === server.parentID){
                client['external'] = server.process['serviceName']
                client['externalGroup'] = server.process['serviceGroup']
                connectivityData.push(client)
                check = true
            }
        })

        // If client id has not server parentId
        if(!check){
            find.map(val=>{
                if(client.tags[val]){
                    client['external'] = `${val.split('.')[0]}.${client.tags[val]}`
                    connectivityData.push(client)
                }
            })
        }
    })

    // If server parentId has not clientId
    servers.map(server=>{
        let check = false
        clients.map(client=>{
            if(server.parentID && server.parentID === client.spanID) check = true
        })
        if(!check){
            const userAgent = server.tags['http.user_agent'] || undefined
            if(!userAgent || (userAgent && (userAgent.includes(' ') || !userAgent.includes('.')))) {
                server['external'] = 'Client'
            }
            else{
                server['externalGroup'] = userAgent.split('.')[0]
                server['external'] = userAgent.split('.')[1]
            }
            
            connectivityData.push(server)
        }
    })

    return reconditionServiceName(connectivityData)
}

function reconditionServiceName(connectivityData = []){
    connectivityData = connectivityData.map(span=>{
        let newString = '', service = '', external='', {serviceName, serviceGroup} = span.process
        serviceName.split('(').forEach(value => newString += value)
        newString.split(')').forEach(value => service += value)
        newString = ''
        span.external.split('(').forEach(value => newString += value)
        newString.split(')').forEach(value => external += value)
        
        let output = {
            kind: span.tags['span.kind'],
            service,
            timestamp: span.startTimeMillis,
            duration: span.duration,
            status: span.tags['otel.status_code'] === 'ERROR' ? 'ERROR':'OK',
            external,
        }
        if (serviceGroup) output['serviceGroup'] = serviceGroup
        if (span.externalGroup) output['externalGroup'] = span.externalGroup
        return output
    })
    return connectivityData
}