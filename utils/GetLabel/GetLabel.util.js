module.exports = GetLabels

function GetLabels(data=[]){
    let newData = data.map(request => {
        let schema = {
            status: request.status 
        }
        switch (request.kind){
            case 'server': {
                schema['service'] = request.service
                schema['client'] = request.external
            }; break;
            case 'client': {
                schema['client'] = request.service
                schema['service'] = request.external
            }; break;
        }
        schema['key'] = `<${schema['client']}>,<${schema['service']}>`
        return schema
    })
    return newData
}