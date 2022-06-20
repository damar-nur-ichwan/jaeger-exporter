require('dotenv').config()

const DEFAULT_INIT_STYLE = "elasticsearch"

const initStyle = process.env['INIT_STYLE'] || DEFAULT_INIT_STYLE

module.exports = initStyle.toLowerCase()