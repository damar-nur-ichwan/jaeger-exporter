const { UpdateFile } = require("dni-file-system")

module.exports = UpdateLast

async function UpdateLast(timestamp=0){
    timestamp = parseInt(timestamp)
    try{
        await UpdateFile('./data/lastUpdated.json',JSON.stringify(timestamp))
    } catch (err){
        logger.error(err)
    }
}