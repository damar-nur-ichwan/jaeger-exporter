require("dotenv").config();

const DEFAULT_SCRAPE_INTERVAL = 15000;

const scrapeInterval =
  process.env["SCRAPE_INTERVAL"] || DEFAULT_SCRAPE_INTERVAL;

module.exports = scrapeInterval;
