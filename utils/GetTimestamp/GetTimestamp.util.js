module.exports = GetTimestamp

function GetTimestamp(data=[]){
    let timestamp = []
    data.map((request)=>{
        timestamp.push(request.timestamp)
    })
    return timestamp
}