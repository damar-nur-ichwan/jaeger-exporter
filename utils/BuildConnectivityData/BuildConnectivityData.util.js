
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
        let check = 0
        servers.map(server=>{
            if(server.parentID && client.spanID === server.parentID){
                client['external'] = server.process['serviceName']
                connectivityData.push(client)
                check++
            }
        })

        // If client id has not server parentId
        if(check === 0){
            find.map(val=>{
                if(client.tags[val]){
                    client['external'] = `${val.split('.')[0]}: ${client.tags[val]}`
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
        if(check){
            server['external'] = 'Client'
            connectivityData.push(server)
        }
    })

    return reconditionServiceName(connectivityData)
}

function reconditionServiceName(connectivityData = []){
    connectivityData = connectivityData.map(span=>{
        let newString = '', service = '', external=''
        span.process['serviceName'].split('(').forEach(value => newString += value)
        newString.split(')').forEach(value => service += value)
        newString = ''
        span.external.split('(').forEach(value => newString += value)
        newString.split(')').forEach(value => external += value)
        return {
            kind: span.tags['span.kind'],
            service,
            timestamp: span.startTimeMillis,
            duration: span.duration,
            status: span.tags['otel.status_code'] === 'ERROR' ? 'ERROR':'OK',
            external
        }
    })
    return connectivityData
}