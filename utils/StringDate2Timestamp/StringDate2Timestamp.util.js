const logger = require("../logger/logger.util");

function StringDate2Timestamp(stringDate=undefined){
    if(!stringDate) return logger.error('the parameter for the ToTimestamp Util is undefined')
    const timestamp = Date.parse(stringDate);
    return timestamp/1000;
}

module.exports = StringDate2Timestamp