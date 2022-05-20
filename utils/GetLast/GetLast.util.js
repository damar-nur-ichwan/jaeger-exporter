const { ReadFile } = require("dni-file-system");

module.exports = GetLast

async function GetLast(){
    try{
        let data = await ReadFile('./data/lastUpdated.json')
        return JSON.parse(data) || 0
    } catch (err){
        console.log(err)
        GetLast()
    }
}