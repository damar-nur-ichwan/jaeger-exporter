const { ReadFile } = require("dni-file-system");

module.exports = GetPromLast

async function GetPromLast(){
    try{
        let data = await ReadFile('./data/lastUpdated.json')
        return JSON.parse(data) || 0
    } catch (err){
        console.log(err)
        GetPromLast()
    }
}