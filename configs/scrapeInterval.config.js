require('dotenv').config()

const scrapeInterval = process.env['SCRAPE_INTERVAL'] || 15000

module.exports = scrapeInterval