const { UpdateFile } = require("dni-file-system")

async function UpdatedAt(timestamp=0){
    timestamp = parseInt(timestamp)
    try{
        await UpdateFile('./data/UpdatedAt.json',JSON.stringify(timestamp))
    } catch (err){
        return logger.error(err)
    }
}

module.exports = UpdatedAt