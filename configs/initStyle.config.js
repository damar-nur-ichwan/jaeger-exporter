require('dotenv').config()

const initStyle = process.env['INIT_STYLE'] || 'none'

module.exports = initStyle.toLowerCase()