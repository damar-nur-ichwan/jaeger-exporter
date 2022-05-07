module.exports = GetResponstime

function GetResponstime (data=[]){
    let value = []
    data.map((request)=>{
            value.push(parseInt(request.duration/1000))
    })
    return value
}